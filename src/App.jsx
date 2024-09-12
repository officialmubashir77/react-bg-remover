import { useState } from 'react';
import axios from 'axios';

function App() {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [fileName, setFileName] = useState('Click to upload image');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); 

      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Image = reader.result;
        setImage(base64Image);
        setLoading(true);
        setErrorMessage(null);

        try {
          const apiKey = '9k75i6YmCQsUA9GDHuEWXhwV'; 

          const formData = new FormData();
          formData.append('image_file', file);
          formData.append('size', 'auto'); 

          const response = await axios.post(
            'https://api.remove.bg/v1.0/removebg',
            formData,
            {
              headers: {
                'X-Api-Key': apiKey,
                'Content-Type': 'multipart/form-data',
              },
              responseType: 'blob', 
            }
          );

          const blob = response.data;
          const url = URL.createObjectURL(blob);
          setProcessedImage(url);
          setDownloadUrl(url);
        } catch (error) {
          console.error('Error removing background:', error);
          setErrorMessage('Failed to remove background. Please check your API key or usage limits.');
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(file);
    } else {
      setFileName('Click to upload image'); 
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setProcessedImage(null);
    setFileName('Click to upload image');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-600 p-4 sm:p-6">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-extrabold text-white mb-2">
          Background Image Remover
        </h1>
        <p className="text-lg text-white">
          Remove the background from your images effortlessly.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mb-6">
        <div className="border-2 border-purple-600 border-dashed rounded-lg p-6 text-center">
          <span className="material-icons-outlined text-4xl text-purple-600">file_upload</span>
          <h3 className="text-2xl font-semibold text-purple-600 mt-4 mb-4">Drag & drop any file here</h3>
          <label className="block text-lg">
            or
            <span className="text-purple-600 font-bold cursor-pointer ml-2">
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
              />
              <span className="underline">browse file</span>
              <span> from device</span>
            </span>
          </label>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="w-16 h-16 border-t-4 border-purple-600 border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 mt-4 p-4 bg-red-100 border border-red-300 rounded-md text-red-800">
          {errorMessage}
        </div>
      )}

      {(image || processedImage) && !loading && (
        <div className="flex flex-col items-center gap-4 mb-6">
          {image && (
            <img
              src={image}
              alt="Original"
              className="w-full max-w-xs rounded-lg shadow-lg"
            />
          )}
          {processedImage && (
            <img
              src={processedImage}
              alt="Processed"
              className="w-full max-w-xs rounded-lg shadow-lg"
            />
          )}
        </div>
      )}

      {(image || processedImage) && !loading && (
        <div className="flex flex-col sm:flex-row gap-4">
          {image && (
            <button
              className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-700"
              onClick={handleRemoveImage}
            >
              Remove Image
            </button>
          )}
          {processedImage && (
            <a
              href={downloadUrl}
              download="processed-image.png"
              className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 flex items-center"
            >
              Download Image
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
