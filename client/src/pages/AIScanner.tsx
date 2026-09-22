import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scan,
  Upload,
  Zap,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  RefreshCw,
  FileImage,
  Info,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import { AIAnalysisResult } from '../types';

const SAMPLE_DEMO_IMAGES = [
  {
    name: 'Old Smartphone',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop',
    filename: 'old_smartphone_battery.jpg',
  },
  {
    name: 'Broken Laptop',
    url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop',
    filename: 'broken_laptop_motherboard.jpg',
  },
  {
    name: 'Li-Ion Battery Pack',
    url: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop',
    filename: 'lithium_ion_battery_pack.jpg',
  },
  {
    name: 'Worn Keyboard',
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop',
    filename: 'broken_keyboard.jpg',
  },
  {
    name: 'Optical Mouse',
    url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop',
    filename: 'old_mouse.jpg',
  },
  {
    name: 'CRT Television',
    url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop',
    filename: 'crt_television.jpg',
  },
  {
    name: 'Office Printer',
    url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop',
    filename: 'broken_printer.jpg',
  },
];

export const AIScanner: React.FC = () => {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sampleFilename, setSampleFilename] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setSampleFilename(null);
      setResult(null);
      setError(null);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_DEMO_IMAGES[0]) => {
    setSelectedFile(null);
    setPreviewUrl(sample.url);
    setSampleFilename(sample.filename);
    setResult(null);
    setError(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSampleFilename(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!previewUrl) {
      setError('Please upload or select an electronic device photo first.');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (sampleFilename) {
        formData.append('sample', sampleFilename);
        formData.append('filename', sampleFilename);
        const sampleObj = SAMPLE_DEMO_IMAGES.find((s) => s.filename === sampleFilename);
        if (sampleObj) {
          formData.append('imageUrl', sampleObj.url);
        }
      } else {
        formData.append('sample', 'old_smartphone_battery.jpg');
        formData.append('filename', 'old_smartphone_battery.jpg');
        formData.append('imageUrl', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop');
      }

      const res = await api.analyzeAIImage(formData);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res.message || 'AI image recognition failed.');
      }
    } catch (err) {
      console.error('AI Scan Error:', err);
      setError('An error occurred during image processing.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#16A6A0]/10 border border-[#16A6A0]/35 text-[#16A6A0] text-xs font-bold shadow-sm">
          <Zap className="w-3.5 h-3.5 text-[#16A6A0]" />
          <span>Computer Vision Scrap Classification</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#071A21] tracking-tight font-['Outfit']">
          AI Electronic Scrap Scanner
        </h1>
        <p className="text-[#5e777f] text-xs sm:text-sm">
          Upload a photo of your electronic device. The model detects item category, estimates recoverable metals (Gold, Copper), safety warnings, and reward points.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Image Upload Box & Sample Selector */}
        <div className="lg:col-span-6 space-y-5">
          
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D1DEDF] shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#071A21] text-xs sm:text-sm">
                Upload Scrap Photo
              </h3>
              {previewUrl && (
                <button
                  onClick={handleClear}
                  className="text-xs font-bold text-red-700 hover:underline"
                >
                  Clear Photo
                </button>
              )}
            </div>

            {/* Dropzone Container */}
            <div className="relative border-2 border-dashed border-[#D1DEDF] hover:border-[#16A6A0] rounded-xl p-6 text-center transition-colors bg-[#F5F7F4] min-h-[220px] flex flex-col items-center justify-center overflow-hidden">
              {previewUrl ? (
                <div className="relative space-y-2.5 w-full">
                  <div className="relative inline-block mx-auto rounded-lg overflow-hidden border border-[#D1DEDF] shadow-sm">
                    <img
                      src={previewUrl}
                      alt="Device Preview"
                      className="max-h-48 rounded-lg object-cover mx-auto"
                    />
                    {/* Scanning Laser Line */}
                    {analyzing && (
                      <div className="absolute inset-0 bg-[#38D9E8]/10 pointer-events-none">
                        <div className="absolute left-0 right-0 h-0.5 bg-[#38D9E8] shadow-[0_0_8px_#38d9e8] animate-scan-laser" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">
                    {analyzing ? 'Scanning item with neural net...' : 'Image loaded & ready for analysis'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 cursor-pointer w-full">
                  <div className="w-12 h-12 rounded-xl bg-[#16A6A0]/10 text-[#16A6A0] flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      Drag & Drop or <span className="text-[#16A6A0] underline">Browse File</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">JPEG, PNG, or WEBP (Max 5MB)</p>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {/* Analyze Action Button */}
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !previewUrl}
              className={`btn-press w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors ${
                analyzing || !previewUrl
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-[#071A21] hover:bg-[#16A6A0] text-white'
              }`}
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Computer Vision Model...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-[#38D9E8]" />
                  <span>Classify & Estimate Recovery</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Demo Samples */}
          <div className="bg-white rounded-2xl p-4 border border-[#D1DEDF] shadow-subtle space-y-2.5">
            <span className="block text-xs font-bold text-[#071A21] uppercase tracking-wider">
              Or Try Demo Devices:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_DEMO_IMAGES.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-2 rounded-xl border text-left text-xs transition-all flex flex-col items-center gap-1.5 ${
                    sampleFilename === sample.filename
                      ? 'border-[#16A6A0] bg-[#16A6A0]/10 ring-1 ring-[#16A6A0]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <span className="text-[11px] font-bold text-slate-700 truncate w-full text-center">
                    {sample.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Analysis Result Output */}
        <div className="lg:col-span-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result ? (
            <div className="bg-white rounded-2xl p-6 border border-[#D1DEDF] shadow-card space-y-5">
              
              {/* Header Analysis Badge */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5e777f]">
                    Detected Scrap Category
                  </span>
                  <h3 className="text-xl font-black text-[#071A21] font-['Outfit']">
                    {result.detectedItem || result.category}
                  </h3>
                  <p className="text-xs text-[#5e777f]">
                    Model Confidence: <strong className="text-[#16A6A0]">{(result.confidence * 100).toFixed(0)}%</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-[#5e777f] block">Disposal Value</span>
                  <span className="text-lg font-black text-[#16A6A0]">+{result.estimatedPoints} Pts</span>
                </div>
              </div>

              {/* Recoverable Materials Extraction Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#071A21] uppercase tracking-wider block">
                  Recoverable Precious Metals & Minerals:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#F5F7F4] p-3 rounded-xl border border-[#D1DEDF] text-center">
                    <span className="block text-[10px] text-[#5e777f] font-bold uppercase">Gold (Au)</span>
                    <span className="text-xs font-bold text-amber-600 truncate block">
                      {result.recyclableMaterials?.gold || '~0.034g'}
                    </span>
                  </div>
                  <div className="bg-[#F5F7F4] p-3 rounded-xl border border-[#D1DEDF] text-center">
                    <span className="block text-[10px] text-[#5e777f] font-bold uppercase">Copper (Cu)</span>
                    <span className="text-xs font-bold text-slate-700 truncate block">
                      {result.recyclableMaterials?.copper || '~15.0g'}
                    </span>
                  </div>
                  <div className="bg-[#F5F7F4] p-3 rounded-xl border border-[#D1DEDF] text-center">
                    <span className="block text-[10px] text-[#5e777f] font-bold uppercase">Silver (Ag)</span>
                    <span className="text-xs font-bold text-[#16A6A0] truncate block">
                      {result.recyclableMaterials?.silver || '~0.35g'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Safety & Pre-Disposal Directives */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <span className="font-bold flex items-center gap-1.5 text-amber-800">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Handling Protocols:
                </span>
                <p className="leading-relaxed text-[11px] text-amber-800/90">{result.safetyNotes}</p>
              </div>

              {/* Recycling Advice */}
              <div className="text-xs text-[#5e777f] bg-[#F5F7F4] p-3.5 rounded-xl border border-[#D1DEDF]">
                <strong className="text-[#071A21] block mb-0.5 font-['Outfit']">Recycling Directive:</strong>
                <p>{result.disposalMethod}</p>
              </div>

              {/* 1-Click Action to Prefilled Pickup Booking */}
              <button
                onClick={() =>
                  navigate(
                    `/pickup?category=${encodeURIComponent(result.category || result.detectedItem)}&weight=${result.estimatedWeightKg}&points=${result.estimatedPoints}`
                  )
                }
                className="btn-press w-full py-3 bg-[#16A6A0] hover:bg-[#0f8580] text-[#071A21] font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <Truck className="w-4 h-4" />
                <span>Book Certified Doorstep Pickup for this Item</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-[#D1DEDF] shadow-card text-center space-y-3">
              <Scan className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-[#071A21] text-sm">Awaiting Device Image</h3>
              <p className="text-xs text-[#5e777f] max-w-sm mx-auto">
                Select an electronic item image on the left or try one of the demo samples to view real-time mineral recovery predictions.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
