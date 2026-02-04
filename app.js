const { useState, useRef } = React;

function QRCodeFixer() {
  const [image, setImage] = useState(null);
  const [scaleX, setScaleX] = useState(1.5);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          drawScaledImage(img, scaleX);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawScaledImage = (img, scale) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    const newWidth = img.width * scale;
    const newHeight = img.height;

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
  };

  const handleScaleChange = (e) => {
    const newScale = parseFloat(e.target.value);
    setScaleX(newScale);
    if (image) {
      drawScaledImage(image, newScale);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fixed-qr-code.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const UploadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
    </svg>
  );

  const DownloadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">QR Code Horizontal Scaling Fixer</h1>
          <p className="text-gray-600 mb-6">Upload your compressed QR code and adjust the horizontal scale to restore it</p>

          <div className="mb-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <UploadIcon />
              Upload Compressed QR Code
            </button>
          </div>

          {image && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horizontal Scale: {scaleX.toFixed(2)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={scaleX}
                  onChange={handleScaleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5x (More compressed)</span>
                  <span>3x (More stretched)</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Original (Compressed)</h3>
                  <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                    <img src={image.src} alt="Original" className="max-w-full h-auto" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Fixed (Scaled)</h3>
                  <div className="border-2 border-indigo-300 rounded-lg p-4 bg-indigo-50">
                    <canvas ref={canvasRef} className="max-w-full h-auto" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={downloadImage}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <DownloadIcon />
                  Download Fixed QR Code
                </button>
               <button
  onClick={() => {
    setScaleX(1);
    if (image) {
      drawScaledImage(image, 1);
    }
  }}
  className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
>
  Reset to 1:1
</button>
                  Reset to 1:1
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Adjust the slider until the QR code appears square and the positioning squares (three corners) look properly proportioned. Then try scanning it with your phone's QR code reader.
                </p>
              </div>
            </>
          )}

          {!image && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <UploadIcon />
              <p className="text-gray-600 mt-4">Upload your horizontally compressed QR code to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<QRCodeFixer />, document.getElementById('root'));
