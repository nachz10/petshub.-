import prisma from "../config/db";
import fsPromises from "fs/promises";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads", "products");

(async () => {
  try {
    await fsPromises.mkdir(UPLOAD_DIR, { recursive: true });
    console.log(`Upload directory ensured: ${UPLOAD_DIR}`);
  } catch (error) {
    console.error("Failed to create upload directory:", error);
  }
})();

interface ProductInputData {
  name: string;
  description?: string;
  price: number;
  availableUnits: number;
  isFeatured?: boolean;
  freeShipping?: boolean;
  returnPolicy?: boolean;
  categoryId: string;
  productTypeId: string;
  animalTargetIds?: string[];
  attributes?: { name: string; value: string }[];
}

interface UploadedFile {
  stream: NodeJS.ReadableStream;
  filename: string;
  mimetype: string;
}

const PRODUCT_INCLUDE_RELATIONS = {
  images: { orderBy: { isPrimary: "desc" } as const },
  category: true,
  productType: {
    include: {
      attributes: true,
    },
  },
  animalTargets: { include: { animalType: true } },
  attributes: true,
  policies: true,
};

export const createProduct = async (
  data: ProductInputData,
  files: UploadedFile[],
  primaryImageIndex?: number
) => {
  const {
    name,
    description,
    price,
    availableUnits,
    isFeatured = false,
    freeShipping = false,
    returnPolicy = false,
    categoryId,
    productTypeId,
    animalTargetIds = [],
    attributes = [],
  } = data;

  if (!files || files.length === 0) {
    throw Object.assign(new Error("At least one image is required."), {
      statusCode: 400,
    });
  }
  if (files.length > 3) {
    throw Object.assign(new Error("Maximum of 3 images allowed."), {
      statusCode: 400,
    });
  }

  const imageObjects: { url: string; isPrimary: boolean }[] = [];
  const successfullyUploadedPaths: string[] = []; // Keep track of files to delete on error

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.mimetype.startsWith("image/")) {
        console.warn(`Skipping non-image file: ${file.filename}`);
        continue;
      }
      const uniqueFilename = `${uuidv4()}-${file.filename.replace(
        /\s+/g,
        "_"
      )}`;
      const filePath = path.join(UPLOAD_DIR, uniqueFilename);

      const writeStream = fs.createWriteStream(filePath);
      await pipeline(file.stream, writeStream); // Correct stream handling
      successfullyUploadedPaths.push(filePath); // Add after successful write

      const imageUrl = `/uploads/products/${uniqueFilename}`;
      imageObjects.push({
        url: imageUrl,
        isPrimary: primaryImageIndex !== undefined && i === primaryImageIndex,
      });
    }

    if (imageObjects.length === 0) {
      throw Object.assign(
        new Error(
          "At least one valid image is required after filtering non-images."
        ),
        {
          statusCode: 400,
        }
      );
    }

    imageObjects.forEach((img) => {
      img.isPrimary = false;
    });

    if (imageObjects.length > 0) {
      imageObjects[0].isPrimary = true;
    }

    return await prisma.products.create({
      data: {
        name,
        description,
        price,
        availableUnits,
        isFeatured,
        freeShipping,
        returnPolicy,
        categoryId,
        productTypeId,
        images: { create: imageObjects },
        animalTargets: {
          create: animalTargetIds.map((animalId) => ({
            animalTypeId: animalId,
          })),
        },
        attributes: {
          create: attributes
            .filter((attr) => attr.value && attr.value.trim() !== "")
            .map((attr) => ({ name: attr.name, value: attr.value })),
        },
      },
      include: PRODUCT_INCLUDE_RELATIONS,
    });
  } catch (error) {
    // Cleanup successfully uploaded files if product creation fails
    for (const uploadedPath of successfullyUploadedPaths) {
      try {
        await fsPromises.unlink(uploadedPath);
        console.log(`Cleaned up file due to error: ${uploadedPath}`);
      } catch (cleanupError) {
        console.error(`Error cleaning up file ${uploadedPath}:`, cleanupError);
      }
    }
    console.error("Error in createProduct service:", error);
    throw error; // Re-throw the original error
  }
};

interface UpdateProductData extends Partial<ProductInputData> {
  primaryImageDesignation?:
    | { type: "existing"; id: string }
    | { type: "new"; index: number };
  imageIdsToDelete?: string[];
}

export const updateProduct = async (
  productId: string,
  data: UpdateProductData,
  newFiles: UploadedFile[] = []
) => {
  const {
    primaryImageDesignation,
    imageIdsToDelete = [],
    animalTargetIds,
    attributes,
    ...productFields
  } = data;

  const existingProduct = await prisma.products.findUnique({
    where: { id: productId },
    include: { images: true },
  });

  if (!existingProduct) {
    throw Object.assign(new Error("Product not found"), { statusCode: 404 });
  }

  // Pre-calculate image counts to validate early
  const currentValidImages = existingProduct.images.filter(
    (img) => !imageIdsToDelete.includes(img.id)
  );
  const validNewFiles = newFiles.filter((file) =>
    file.mimetype.startsWith("image/")
  );
  const totalExpectedImages = currentValidImages.length + validNewFiles.length;

  if (totalExpectedImages === 0) {
    throw Object.assign(
      new Error("Product must have at least one image after updates."),
      { statusCode: 400 }
    );
  }
  if (totalExpectedImages > 3) {
    throw Object.assign(
      new Error("Product cannot have more than 3 images after updates."),
      { statusCode: 400 }
    );
  }

  const newImageObjects: { url: string; isPrimary: boolean }[] = [];
  let newPrimarySetByUpload = false;
  const successfullyUploadedPathsForUpdate: string[] = [];

  try {
    for (let i = 0; i < validNewFiles.length; i++) {
      const file = validNewFiles[i];
      // Mimetype check already done for validNewFiles
      const uniqueFilename = `${uuidv4()}-${file.filename.replace(
        /\s+/g,
        "_"
      )}`;
      const filePath = path.join(UPLOAD_DIR, uniqueFilename);
      const writeStream = fs.createWriteStream(filePath);
      await pipeline(file.stream, writeStream);
      successfullyUploadedPathsForUpdate.push(filePath);

      const imageUrl = `/uploads/products/${uniqueFilename}`;
      let isPrimary = false;
      if (
        primaryImageDesignation?.type === "new" &&
        primaryImageDesignation.index === i // Index here refers to the index in `validNewFiles`
      ) {
        isPrimary = true;
        newPrimarySetByUpload = true;
      }
      newImageObjects.push({ url: imageUrl, isPrimary });
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Handle image deletions from disk and DB
      if (imageIdsToDelete.length > 0) {
        const imagesToDeleteRecords = await tx.productImage.findMany({
          where: { id: { in: imageIdsToDelete }, productId },
        });
        for (const img of imagesToDeleteRecords) {
          try {
            const filename = path.basename(img.url);
            if (
              filename &&
              filename !== "products" &&
              !filename.includes("..")
            ) {
              // Basic security check
              await fsPromises.unlink(path.join(UPLOAD_DIR, filename));
            }
          } catch (e: any) {
            if (e.code !== "ENOENT") {
              // Log if not "File not found"
              console.error(`Failed to delete image file ${img.url}:`, e);
            } else {
              console.warn(
                `Image file not found for deletion (may already be deleted): ${img.url}`
              );
            }
          }
        }
        await tx.productImage.deleteMany({
          where: { id: { in: imageIdsToDelete }, productId },
        });
      }

      // 2. Unset existing primary flags if a new upload is primary or if primary is being changed
      if (
        newPrimarySetByUpload ||
        primaryImageDesignation?.type === "existing"
      ) {
        await tx.productImage.updateMany({
          where: { productId, isPrimary: true },
          data: { isPrimary: false },
        });
      }

      // 3. Update product fields and create new image records
      const updatePayload: any = { ...productFields };
      if (newImageObjects.length > 0) {
        updatePayload.images = { create: newImageObjects };
      }

      // Handle animal targets and attributes (delete all then re-create)
      if (animalTargetIds !== undefined) {
        await tx.productAnimalTarget.deleteMany({ where: { productId } });
        if (animalTargetIds.length > 0) {
          updatePayload.animalTargets = {
            create: animalTargetIds.map((id) => ({ animalTypeId: id })),
          };
        }
      }
      if (attributes !== undefined) {
        await tx.productAttribute.deleteMany({ where: { productId } });
        const validAttributes = attributes
          .filter((attr) => attr.value && attr.value.trim() !== "")
          .map((attr) => ({ name: attr.name, value: attr.value }));
        if (validAttributes.length > 0) {
          updatePayload.attributes = { create: validAttributes };
        }
      }

      await tx.products.update({
        where: { id: productId },
        data: updatePayload,
      });

      // 4. Set new primary image if an existing one was designated
      if (
        primaryImageDesignation?.type === "existing" &&
        !newPrimarySetByUpload
      ) {
        try {
          await tx.productImage.update({
            where: { id: primaryImageDesignation.id, productId: productId },
            data: { isPrimary: true },
          });
        } catch (e) {
          console.warn(
            `Could not set existing image ${primaryImageDesignation.id} as primary. It might have been deleted.`
          );
        }
      }

      // 5. Final check: Ensure one primary image exists from all current images
      const currentImagesAfterUpdate = await tx.productImage.findMany({
        where: { productId },
        orderBy: { createdAt: "asc" }, // Consistent order
      });

      if (currentImagesAfterUpdate.length > 0) {
        const currentPrimaryImages = currentImagesAfterUpdate.filter(
          (img) => img.isPrimary
        );
        if (currentPrimaryImages.length === 0) {
          // If no primary, set the first one
          await tx.productImage.update({
            where: { id: currentImagesAfterUpdate[0].id },
            data: { isPrimary: true },
          });
        } else if (currentPrimaryImages.length > 1) {
          // If somehow multiple primaries (shouldn't happen with above logic), fix it
          for (let i = 1; i < currentPrimaryImages.length; i++) {
            await tx.productImage.update({
              where: { id: currentPrimaryImages[i].id },
              data: { isPrimary: false },
            });
          }
        }
      }
      // The image count checks (0 or >3) should have been caught by pre-validation.
      // If they are violated here, it's a critical logic error in the transaction.

      return tx.products.findUnique({
        where: { id: productId },
        include: PRODUCT_INCLUDE_RELATIONS,
      });
    });
  } catch (error) {
    for (const uploadedPath of successfullyUploadedPathsForUpdate) {
      try {
        await fsPromises.unlink(uploadedPath);
        console.log(`Cleaned up file due to update error: ${uploadedPath}`);
      } catch (cleanupError) {
        console.error(
          `Error cleaning up file ${uploadedPath} during update error:`,
          cleanupError
        );
      }
    }
    console.error(`Error in updateProduct service for ${productId}:`, error);
    throw error;
  }
};

export const getAllProducts = async () => {
  return await prisma.products.findMany({
    include: PRODUCT_INCLUDE_RELATIONS,
    orderBy: { createdAt: "desc" },
  });
};

export const getProductById = async (id: string) => {
  const product = await prisma.products.findUnique({
    where: { id },
    include: PRODUCT_INCLUDE_RELATIONS,
  });
  if (!product) {
    throw Object.assign(new Error("Product not found"), { statusCode: 404 });
  }
  return product;
};

export const deleteProduct = async (id: string) => {
  const product = await prisma.products.findUnique({
    where: { id },
    select: { images: { select: { url: true } } },
  });

  if (product?.images) {
    for (const img of product.images) {
      try {
        const filename = path.basename(img.url);
        if (filename && filename !== "products" && !filename.includes("..")) {
          await fsPromises.unlink(path.join(UPLOAD_DIR, filename));
        }
      } catch (e: any) {
        if (e.code !== "ENOENT") {
          console.error(
            `Failed to delete image file ${img.url} for product ${id}:`,
            e
          );
        } else {
          console.warn(
            `Image file not found for deletion during product delete: ${img.url}`
          );
        }
      }
    }
  }
  return await prisma.products.delete({ where: { id } });
};
