import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { useDropzone } from "react-dropzone";
import { Upload, Mic, MicOff, Check, Image, ArrowRight } from "lucide-react";

const CreateDigitalTwinPage = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
    } else {
      setIsRecording(true);
      setHasRecorded(false);
      // Simulate recording timer
      let time = 0;
      const interval = setInterval(() => {
        time += 1;
        setRecordingTime(time);
        if (time >= 30) {
          clearInterval(interval);
          setIsRecording(false);
          setHasRecorded(true);
        }
      }, 1000);
    }
  };

  const handleSubmit = () => {
    navigate("/digital-twin-progress");
  };

  const scriptText = `"Hi everyone! I'm so excited to share something amazing with you. I've been working on creating my very own digital twin — a version of me that can connect with all of you in new and creative ways. Stay tuned for more!"`;

  return (
    <Layout userType="influencer">
      <div className="p-8 max-w-4xl mx-auto" data-testid="create-digital-twin-page">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full text-sm font-medium text-orange-600 mb-4">
            Digital Twin Studio
          </span>
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Create Your Digital Twin
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Upload a photo and record your voice so we can build a lifelike
            digital version of you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Photo Section */}
          <div className="bg-white rounded-3xl p-8 shadow-soft">
            <h2 className="font-outfit text-xl font-semibold mb-2">
              Upload Your Photo
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              This will be used to create your twin's appearance
            </p>

            {/* Guidelines */}
            <div className="space-y-2 mb-6 text-sm">
              <p className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <span>
                  Use a <strong>well-lit, front-facing</strong> headshot with a
                  clean background
                </span>
              </p>
              <p className="flex items-start gap-2 text-muted-foreground">
                <span className="w-4 h-4 flex-shrink-0 text-center">✕</span>
                <span>Avoid sunglasses, hats or heavy filters</span>
              </p>
              <p className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <span>
                  Minimum resolution: <strong>512 × 512 px</strong>
                </span>
              </p>
            </div>

            {/* Sample Reference */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Sample reference</p>
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1524158572048-994dc70d2b58?w=200&h=200&fit=crop"
                  alt="Sample reference"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? "border-orange-400 bg-orange-50"
                  : uploadedImage
                  ? "border-teal-400 bg-teal-50"
                  : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
              }`}
              data-testid="photo-dropzone"
            >
              <input {...getInputProps()} data-testid="photo-input" />
              {uploadedImage ? (
                <div className="space-y-4">
                  <img
                    src={uploadedImage.preview}
                    alt="Uploaded"
                    className="w-32 h-32 rounded-2xl mx-auto object-cover"
                  />
                  <p className="text-teal-600 font-medium">Photo uploaded!</p>
                  <p className="text-sm text-muted-foreground">
                    Click or drag to replace
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                    {isDragActive ? (
                      <Image className="w-8 h-8 text-orange-500" />
                    ) : (
                      <Upload className="w-8 h-8 text-orange-500" />
                    )}
                  </div>
                  <p className="font-medium text-foreground mb-1">
                    {isDragActive
                      ? "Drop your photo here"
                      : "Click to upload your photo"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG — max 10 MB
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Record Voice Section */}
          <div className="bg-white rounded-3xl p-8 shadow-soft">
            <h2 className="font-outfit text-xl font-semibold mb-2">
              Record Your Voice
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Read the text below aloud so we can clone your voice
            </p>

            {/* Script to read */}
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Read this aloud
              </p>
              <p className="text-foreground leading-relaxed italic">{scriptText}</p>
            </div>

            {/* Recording Button */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {isRecording
                  ? `Recording... ${recordingTime}s`
                  : hasRecorded
                  ? "Recording complete!"
                  : "Tap the mic to start recording"}
              </p>

              <button
                onClick={toggleRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording
                    ? "bg-red-500 animate-pulse shadow-lg shadow-red-500/30"
                    : hasRecorded
                    ? "bg-teal-500 shadow-lg shadow-teal-500/30"
                    : "bg-gradient-to-r from-orange-400 to-pink-500 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
                }`}
                data-testid="record-btn"
              >
                {isRecording ? (
                  <MicOff className="w-10 h-10 text-white" />
                ) : hasRecorded ? (
                  <Check className="w-10 h-10 text-white" />
                ) : (
                  <Mic className="w-10 h-10 text-white" />
                )}
              </button>

              {hasRecorded && (
                <p className="text-teal-600 font-medium mt-4">
                  Voice recorded successfully!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-between max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate("/influencer-profile")}
            className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
            data-testid="back-btn"
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!uploadedImage || !hasRecorded}
            className="h-14 px-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold text-lg shadow-lg shadow-orange-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="generate-twin-btn"
          >
            Generate Your Digital Twin
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CreateDigitalTwinPage;
