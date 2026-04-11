import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
  FormHelperText,
  IconButton,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera, Delete as DeleteIcon } from "@mui/icons-material";
import { getCategories } from "../../api/categories";
import { getProductTypes } from "../../api/productTypes";
import { getAnimalTypes } from "../../api/animalTypes";
import {
  Product,
  ProductImageAPI,
  CategoryAPI,
  ProductTypeAPI,
  AnimalTypeAPI,
  ProductTypeAttributeDefinitionAPI,
} from "../../api/newProduct";

export interface ProductFormState {
  id: string | null;
  name: string;
  description: string;
  price: string;
  availableUnits: string;
  isFeatured: boolean;
  freeShipping: boolean;
  returnPolicy: boolean;
  categoryId: string;
  productTypeId: string;
  animalTargetIds: string[];
  attributes: Record<string, string>;

  existingImages: ProductImageAPI[]; // For edit mode
  newImageFiles: File[];
  primaryImageDesignation:
    | { type: "existing"; id: string }
    | { type: "new"; index: number }
    | null;
  imageIdsToDelete: string[]; // IDs of existing images to remove on update
}

const initialFormState: ProductFormState = {
  id: null,
  name: "",
  description: "",
  price: "",
  availableUnits: "",
  isFeatured: false,
  freeShipping: false,
  returnPolicy: false,
  categoryId: "",
  productTypeId: "",
  animalTargetIds: [],
  attributes: {},
  existingImages: [],
  newImageFiles: [],
  primaryImageDesignation: null,
  imageIdsToDelete: [],
};

interface ImagePreview {
  key: string; // Unique key for React rendering
  url: string;
  isNew: boolean;
  identifier: string | number;
  originalFilename?: string; // For alt text or display
}

interface ProductEditModalProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (formData: FormData, productId: string | null) => Promise<void>;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  open,
  product,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ProductFormState>(initialFormState);
  const [categories, setCategories] = useState<CategoryAPI[]>([]);
  const [productTypes, setProductTypes] = useState<ProductTypeAPI[]>([]);
  const [animalTypes, setAnimalTypes] = useState<AnimalTypeAPI[]>([]);
  const [currentProductTypeAttrs, setCurrentProductTypeAttrs] = useState<
    ProductTypeAttributeDefinitionAPI[]
  >([]);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [loadingSupportData, setLoadingSupportData] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    if (open) {
      setLoadingSupportData(true);
      Promise.all([getCategories(), getProductTypes(), getAnimalTypes()])
        .then(([cats, pTypes, aTypes]) => {
          setCategories(cats || []);
          setProductTypes(pTypes || []);
          setAnimalTypes(aTypes || []);
        })
        .catch((err) => {
          console.error("Failed to load support data:", err);
          setErrors((prev) => ({
            ...prev,
            form: "Failed to load support data.",
          }));
        })
        .finally(() => setLoadingSupportData(false));
    }
  }, [open]);

  useEffect(() => {
    if (open && product) {
      const primaryImg = product.images.find((img) => img.isPrimary);
      setFormData({
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        availableUnits: product.availableUnits.toString(),
        isFeatured: product.isFeatured,
        freeShipping: product.freeShipping,
        returnPolicy: product.returnPolicy,
        categoryId: product.categoryId,
        productTypeId: product.productTypeId,
        animalTargetIds: product.animalTargets.map((at) => at.animalTypeId),
        attributes: product.attributes.reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {} as Record<string, string>),
        existingImages: product.images,
        newImageFiles: [],
        primaryImageDesignation: primaryImg
          ? { type: "existing", id: primaryImg.id }
          : null,
        imageIdsToDelete: [],
      });
    } else if (open && !product) {
      setFormData(initialFormState);
    }
    if (!open) {
      setFormData(initialFormState);
      setImagePreviews([]);
      setCurrentProductTypeAttrs([]);
    }
    setErrors({});
  }, [open, product]);

  useEffect(() => {
    const selectedType = productTypes.find(
      (pt) => pt.id === formData.productTypeId
    );
    setCurrentProductTypeAttrs(selectedType?.attributes || []);
    if (selectedType && product) {
    } else if (!product && selectedType) {
      setFormData((prev) => ({ ...prev, attributes: {} }));
    }
  }, [formData.productTypeId, productTypes, product]);

  useEffect(() => {
    const newFilePreviews: ImagePreview[] = formData.newImageFiles.map(
      (file, index) => ({
        key: `new-${index}-${file.name}-${file.lastModified}`,
        url: URL.createObjectURL(file),
        isNew: true,
        identifier: index,
        originalFilename: file.name,
      })
    );

    const existingImagePreviews: ImagePreview[] = formData.existingImages
      .filter((img) => !formData.imageIdsToDelete.includes(img.id))
      .map((img) => ({
        key: `existing-${img.id}`,
        url: img.url.startsWith("http") ? img.url : `${API_BASE_URL}${img.url}`,
        isNew: false,
        identifier: img.id,
      }));

    setImagePreviews([...existingImagePreviews, ...newFilePreviews]);

    return () => {
      newFilePreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [
    formData.newImageFiles,
    formData.existingImages,
    formData.imageIdsToDelete,
    API_BASE_URL,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (
    name: keyof ProductFormState,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAttributeChange = (attrName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [attrName]: value },
    }));
    if (errors[`attribute_${attrName}`])
      setErrors((prev) => ({ ...prev, [`attribute_${attrName}`]: "" }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const currentTotalImages = imagePreviews.length;

      if (currentTotalImages + files.length > 3) {
        setErrors((prev) => ({ ...prev, images: "Maximum 3 images allowed." }));
        return;
      }

      setFormData((prev) => {
        const newImageFilesBaseIndex = prev.newImageFiles.length;
        const shouldSetPrimary =
          !prev.primaryImageDesignation &&
          prev.existingImages.filter(
            (img) => !prev.imageIdsToDelete.includes(img.id)
          ).length === 0 &&
          prev.newImageFiles.length === 0 &&
          files.length > 0;

        return {
          ...prev,
          newImageFiles: [...prev.newImageFiles, ...files],
          primaryImageDesignation: shouldSetPrimary
            ? { type: "new", index: newImageFilesBaseIndex }
            : prev.primaryImageDesignation,
        };
      });

      if (errors.images) setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const removeImage = (identifier: string | number, isNew: boolean) => {
    if (isNew) {
      const indexToRemove = identifier as number;
      setFormData((prev) => {
        const updatedFiles = prev.newImageFiles.filter(
          (_, i) => i !== indexToRemove
        );
        let newPrimary = prev.primaryImageDesignation;

        if (newPrimary?.type === "new") {
          if (newPrimary.index === indexToRemove) {
            newPrimary = null;
          } else if (newPrimary.index > indexToRemove) {
            newPrimary = { ...newPrimary, index: newPrimary.index - 1 };
          }
        }
        if (!newPrimary && updatedFiles.length > 0) {
          newPrimary = { type: "new", index: 0 };
        } else if (
          !newPrimary &&
          prev.existingImages.filter(
            (img) =>
              !prev.imageIdsToDelete.includes(img.id) && img.id !== identifier
          ).length > 0
        ) {
          const firstExisting = prev.existingImages.filter(
            (img) =>
              !prev.imageIdsToDelete.includes(img.id) && img.id !== identifier
          )[0];
          if (firstExisting)
            newPrimary = { type: "existing", id: firstExisting.id };
        }

        return {
          ...prev,
          newImageFiles: updatedFiles,
          primaryImageDesignation: newPrimary,
        };
      });
    } else {
      const idToRemove = identifier as string;
      setFormData((prev) => {
        let newPrimary = prev.primaryImageDesignation;
        if (newPrimary?.type === "existing" && newPrimary.id === idToRemove) {
          newPrimary = null;
        }

        const remainingExisting = prev.existingImages.filter(
          (img) =>
            img.id !== idToRemove && !prev.imageIdsToDelete.includes(img.id)
        );
        const remainingNew = prev.newImageFiles;

        if (
          !newPrimary &&
          (remainingExisting.length > 0 || remainingNew.length > 0)
        ) {
          if (remainingNew.length > 0) {
            newPrimary = { type: "new", index: 0 };
          } else if (remainingExisting.length > 0) {
            newPrimary = { type: "existing", id: remainingExisting[0].id };
          }
        }

        return {
          ...prev,
          imageIdsToDelete: [...prev.imageIdsToDelete, idToRemove],
          primaryImageDesignation: newPrimary,
        };
      });
    }
  };

  const setPrimary = (identifier: string | number, isNew: boolean) => {
    if (isNew) {
      setFormData((prev) => ({
        ...prev,
        primaryImageDesignation: { type: "new", index: identifier as number },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        primaryImageDesignation: {
          type: "existing",
          id: identifier as string,
        },
      }));
    }
  };

  const validate = (): boolean => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) err.name = "Name is required";
    if (
      !formData.price ||
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    )
      err.price = "Valid price required";
    if (
      !formData.availableUnits ||
      isNaN(parseInt(formData.availableUnits)) ||
      parseInt(formData.availableUnits) < 0
    )
      err.availableUnits = "Valid units required";
    if (!formData.categoryId) err.categoryId = "Category required";
    if (!formData.productTypeId) err.productTypeId = "Product type required";

    const activeImagesCount = imagePreviews.length;
    if (activeImagesCount === 0) err.images = "At least one image required";
    if (activeImagesCount > 3) err.images = "Max 3 images";
    if (activeImagesCount > 0 && !formData.primaryImageDesignation) {
    }

    currentProductTypeAttrs.forEach((attrDef) => {
      if (attrDef.isRequired && !formData.attributes[attrDef.name]?.trim()) {
        err[`attribute_${attrDef.name}`] = `${attrDef.name} is required`;
      }
    });
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (imagePreviews.length > 0 && !formData.primaryImageDesignation) {
      const firstImage = imagePreviews[0];
      setFormData((currentFormData) => {
        const newPrimaryDesignation = firstImage.isNew
          ? { type: "new" as "new", index: firstImage.identifier as number }
          : {
              type: "existing" as "existing",
              id: firstImage.identifier as string,
            };
        return {
          ...currentFormData,
          primaryImageDesignation: newPrimaryDesignation,
        };
      });
    }

    if (!validate()) return;

    let currentFormData = { ...formData };
    if (imagePreviews.length > 0 && !currentFormData.primaryImageDesignation) {
      const firstImage = imagePreviews[0];
      currentFormData.primaryImageDesignation = firstImage.isNew
        ? { type: "new", index: firstImage.identifier as number }
        : { type: "existing", id: firstImage.identifier as string };
    }

    const submission = new FormData();
    submission.append("name", currentFormData.name);
    submission.append("description", currentFormData.description);
    submission.append("price", currentFormData.price);
    submission.append("availableUnits", currentFormData.availableUnits);
    submission.append("isFeatured", String(currentFormData.isFeatured));
    submission.append("freeShipping", String(currentFormData.freeShipping));
    submission.append("returnPolicy", String(currentFormData.returnPolicy));
    submission.append("categoryId", currentFormData.categoryId);
    submission.append("productTypeId", currentFormData.productTypeId);

    currentFormData.animalTargetIds.forEach((id) =>
      submission.append("animalTargetIds[]", id)
    );
    const attributesArray = Object.entries(currentFormData.attributes)
      .map(([name, value]) => ({ name, value }))
      .filter((attr) => attr.value.trim() !== "");
    submission.append("attributes", JSON.stringify(attributesArray));

    currentFormData.newImageFiles.forEach((file) =>
      submission.append("newImages", file)
    );

    if (currentFormData.id) {
      currentFormData.imageIdsToDelete.forEach((id) =>
        submission.append("imageIdsToDelete[]", id)
      );
    }
    if (currentFormData.primaryImageDesignation) {
      if (currentFormData.id) {
        submission.append(
          "primaryImageDesignation",
          JSON.stringify(currentFormData.primaryImageDesignation)
        );
      } else {
        if (currentFormData.primaryImageDesignation.type === "new") {
          submission.append(
            "primaryImageIndex",
            String(currentFormData.primaryImageDesignation.index)
          );
        }
      }
    } else if (imagePreviews.length > 0) {
      console.warn("Submitting with images but no primary designation!");
    }

    try {
      await onSave(submission, currentFormData.id);
    } catch (error: any) {
      console.error("Save product error:", error);
      setErrors((prev) => ({
        ...prev,
        form: error.message || "Failed to save product.",
      }));
    }
  };

  const isImagePrimary = (
    identifier: string | number,
    isNew: boolean
  ): boolean => {
    if (!formData.primaryImageDesignation) return false;
    if (isNew) {
      return (
        formData.primaryImageDesignation.type === "new" &&
        formData.primaryImageDesignation.index === identifier
      );
    }
    return (
      formData.primaryImageDesignation.type === "existing" &&
      formData.primaryImageDesignation.id === identifier
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {formData.id ? "Edit Product" : "Add New Product"}
      </DialogTitle>
      <DialogContent>
        {loadingSupportData ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            component="form"
            noValidate
            sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="price"
                  label="Price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  error={!!errors.price}
                  helperText={errors.price}
                  fullWidth
                  required
                  inputProps={{ step: "0.01", min: "0.01" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="availableUnits"
                  label="Units"
                  type="number"
                  value={formData.availableUnits}
                  onChange={handleChange}
                  error={!!errors.availableUnits}
                  helperText={errors.availableUnits}
                  fullWidth
                  required
                  inputProps={{ min: "0" }}
                />
              </Grid>
            </Grid>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                  />
                }
                label="Featured"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="freeShipping"
                    checked={formData.freeShipping}
                    onChange={handleChange}
                  />
                }
                label="Free Shipping"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="returnPolicy"
                    checked={formData.returnPolicy}
                    onChange={handleChange}
                  />
                }
                label="Return Policy"
              />
            </Box>

            <FormControl fullWidth error={!!errors.categoryId} required>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="categoryId"
                value={formData.categoryId}
                label="Category"
                onChange={(e) =>
                  handleSelectChange("categoryId", e.target.value as string)
                }
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoryId && (
                <FormHelperText>{errors.categoryId}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={!!errors.productTypeId} required>
              <InputLabel id="product-type-label">Product Type</InputLabel>
              <Select
                labelId="product-type-label"
                name="productTypeId"
                value={formData.productTypeId}
                label="Product Type"
                onChange={(e) =>
                  handleSelectChange("productTypeId", e.target.value as string)
                }
              >
                {productTypes.map((pt) => (
                  <MenuItem key={pt.id} value={pt.id}>
                    {pt.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.productTypeId && (
                <FormHelperText>{errors.productTypeId}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="animal-targets-label">Target Animals</InputLabel>
              <Select
                labelId="animal-targets-label"
                multiple
                name="animalTargetIds"
                value={formData.animalTargetIds}
                onChange={(e) =>
                  handleSelectChange(
                    "animalTargetIds",
                    e.target.value as string[]
                  )
                }
                input={<OutlinedInput label="Target Animals" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as string[]).map((id) => (
                      <Chip
                        key={id}
                        label={
                          animalTypes.find((at) => at.id === id)?.name || id
                        }
                      />
                    ))}
                  </Box>
                )}
              >
                {animalTypes.map((at) => (
                  <MenuItem key={at.id} value={at.id}>
                    {at.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {currentProductTypeAttrs.length > 0 && (
              <Typography variant="subtitle2" mt={1} mb={0}>
                Specific Attributes:
              </Typography>
            )}
            {currentProductTypeAttrs.map((attrDef) => (
              <TextField
                key={attrDef.id}
                label={`${attrDef.name}${attrDef.isRequired ? " *" : ""}`}
                value={formData.attributes[attrDef.name] || ""}
                onChange={(e) =>
                  handleAttributeChange(attrDef.name, e.target.value)
                }
                error={!!errors[`attribute_${attrDef.name}`]}
                helperText={
                  errors[`attribute_${attrDef.name}`] || attrDef.description
                }
                fullWidth
                required={attrDef.isRequired}
              />
            ))}

            <Typography variant="subtitle1" mt={1}>
              Images (min 1, max 3)
            </Typography>
            <Grid container spacing={1}>
              {imagePreviews.map((preview) => (
                <Grid
                  item
                  key={preview.key}
                  xs={4}
                  sx={{
                    border: isImagePrimary(preview.identifier, preview.isNew)
                      ? "2px solid dodgerblue"
                      : "1px solid #ccc",
                    padding: "2px",
                    position: "relative",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                >
                  <img
                    src={preview.url}
                    alt={preview.originalFilename || "Product image preview"}
                    style={{
                      width: "100%",
                      height: 100,
                      objectFit: "cover",
                      display: "block",
                      borderRadius: "2px",
                    }}
                  />
                  <IconButton
                    aria-label="Delete image"
                    size="small"
                    onClick={() =>
                      removeImage(preview.identifier, preview.isNew)
                    }
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      background: "rgba(255,255,255,0.7)",
                      "&:hover": { background: "rgba(255,255,255,0.9)" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  {!isImagePrimary(preview.identifier, preview.isNew) && (
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        setPrimary(preview.identifier, preview.isNew)
                      }
                      sx={{
                        fontSize: "0.65rem",
                        marginTop: "4px",
                        textTransform: "none",
                      }}
                    >
                      Set as Primary
                    </Button>
                  )}
                </Grid>
              ))}
            </Grid>
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
              sx={{ mt: 1, alignSelf: "flex-start" }}
              disabled={imagePreviews.length >= 3}
            >
              Upload Images
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                onClick={(e) => ((e.target as HTMLInputElement).value = "")}
              />
            </Button>
            {errors.images && (
              <FormHelperText error>{errors.images}</FormHelperText>
            )}
            {errors.form && (
              <FormHelperText error sx={{ mt: 1, textAlign: "center" }}>
                {errors.form}
              </FormHelperText>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductEditModal;
