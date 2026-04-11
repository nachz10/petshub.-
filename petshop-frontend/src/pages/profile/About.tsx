const AboutUsPage = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-xl overflow-hidden mb-12">
          <img
            src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
            alt="Veterinarian caring for a dog"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent flex items-center">
            <div className="p-8">
              <h1 className="text-4xl font-bold text-white sm:text-5xl">
                About Pets and Vets
              </h1>
              <p className="mt-4 text-lg text-white">
                Your Trusted Partner in Pet Care and Wellness
              </p>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-semibold text-slate-700 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                At Pets and Vets, our mission is simple: to provide exceptional
                care, quality products, and expert advice to ensure the health
                and happiness of your beloved pets. We believe that pets are
                family, and they deserve the very best.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                We strive to be a comprehensive resource for pet owners,
                offering everything from essential supplies and nutritious food
                to professional veterinary services, all under one roof.
              </p>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                alt="Happy dog with owner"
                className="rounded-lg shadow-lg w-full h-64 object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mb-12 bg-white p-8 rounded-lg shadow-md">
          <div className="flex flex-col-reverse md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                alt="Our veterinary clinic"
                className="rounded-lg shadow-md w-full h-64 object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-semibold text-slate-700 mb-6">
                Our Story
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                Pets and Vets was founded by a group of passionate animal lovers
                and experienced veterinary professionals who saw a need for a
                more integrated and compassionate approach to pet care in our
                community. We started with a small clinic and a curated
                selection of products, driven by the desire to make high-quality
                pet care accessible and convenient.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Over the years, we've grown, but our core values remain
                unchanged. We are committed to continuous learning, embracing
                new advancements in veterinary medicine, and always putting the
                well-being of your pets first.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-slate-700 mb-6 text-center">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-blue-700">
                  Quality Pet Products
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We stock a wide range of high-quality pet foods, treats, toys,
                accessories, and healthcare products from trusted brands. Our
                team can help you choose the best items for your pet's specific
                needs.
              </p>
              <img
                src="https://images.unsplash.com/photo-1556035511-3168381ea4d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                alt="Pet toys and accessories"
                className="rounded-lg mt-4 w-full h-48 object-cover"
              />
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-green-700">
                  Expert Veterinary Services
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Our state-of-the-art clinic offers a full suite of veterinary
                services, including routine check-ups, vaccinations, dental
                care, diagnostics, surgery, and emergency care. Our
                compassionate vets are here for you and your pet.
              </p>
              <img
                src="https://images.unsplash.com/photo-1612531822260-6143c9d4c018?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                alt="Veterinarian examining a pet"
                className="rounded-lg mt-4 w-full h-48 object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mb-12 text-center">
          <h2 className="text-3xl font-semibold text-slate-700 mb-6">
            Meet Our Passionate Team
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-8 max-w-2xl mx-auto">
            Our team is our greatest asset. Comprised of skilled veterinarians,
            knowledgeable vet technicians, and friendly customer service staff,
            everyone at Pets and Vets shares a deep love for animals and a
            commitment to providing outstanding care.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                alt="Veterinarian"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-slate-700">
                Dr. Sarah Johnson
              </h3>
              <p className="text-gray-600">Lead Veterinarian</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                alt="Vet technician"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-slate-700">Emma Wilson</h3>
              <p className="text-gray-600">Senior Vet Technician</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                alt="Pet nutrition specialist"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-slate-700">Michael Thompson</h3>
              <p className="text-gray-600">Pet Nutrition Specialist</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
