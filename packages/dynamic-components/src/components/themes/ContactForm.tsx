import { useState } from "react";
// import { insertData } from "../services/apiService";
// import { useSnackbar } from "../Context/SnackbarContext";

const ContactUs = () => {
  // const {showSnackbar} = useSnackbar()
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    message: ""
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formValues);
    alert('Thank you for your message! (API integration pending)');
    setFormValues({ name: "", email: "", message: "" });
    /*
    const { error } = await insertData('queries',{
      name: formValues.name,
      email: formValues.email,
      message: formValues.message,
    });
    if (error) {
      showSnackbar(error.message, 'error')
    }
    else{
      showSnackbar('Message saved successfully!', 'success')
      setFormValues({ name: "", email: "", message: "" });
    }
    */
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  return (
    <div className="min-h-full py-20 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg">
        <h2 className="text-2xl font-bold text-primary text-center mb-4">
          Contact Us
        </h2>
        <p className="text-gray-600 text-center mb-6">
          We’d love to hear from you! Fill out the form below, and we’ll get
          back to you shortly.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-1"
            >
              Name
            </label>
            <input
              onChange={handleInputChange}
              value={formValues.name}
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email
            </label>
            <input
              onChange={handleInputChange}
              value={formValues.email}
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-gray-700 font-medium mb-1"
            >
              Message
            </label>
            <textarea
              onChange={handleInputChange}
              value={formValues.message}
              name="message"
              placeholder="Your Message"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-2 rounded-md hover:bg-primary transition duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
