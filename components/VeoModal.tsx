import React, { useState, useRef } from 'react';
import { X, Upload, Clapperboard, Loader2, Film } from 'lucide-react';
import { generateVeoVideo } from '../services/gemini';

interface VeoModalProps {
    onClose: () => void;
}

const VeoModal: React.FC<VeoModalProps> = ({ onClose }) => {
    const [image, setImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('Cinematic slow motion shot of this delicious food');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setVideoUrl(null);
                setError('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!image) return;
        setLoading(true);
        setError('');
        setVideoUrl(null);
        
        try {
            const url = await generateVeoVideo(image, prompt, aspectRatio);
            if (url) {
                setVideoUrl(url);
            } else {
                setError("Failed to generate video.");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during generation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
             <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-violet-50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-violet-100 rounded-full text-violet-600">
                            <Clapperboard className="w-6 h-6" />
                        </div>
                        <div>
                             <h2 className="text-xl font-bold text-slate-800">Veo Video Studio</h2>
                             <p className="text-sm text-slate-500">Turn photos into videos with AI</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Upload Section */}
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                            image ? 'border-violet-300 bg-violet-50/30' : 'border-slate-200 hover:border-violet-400 hover:bg-slate-50'
                        }`}
                    >
                        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                        
                        {image ? (
                            <div className="relative inline-block">
                                <img src={image} alt="Preview" className="max-h-64 rounded-lg shadow-md" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                                    <span className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> Change Image</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-slate-400">
                                <Upload className="w-12 h-12 mb-3" />
                                <p className="font-medium text-slate-600">Click to upload a photo</p>
                                <p className="text-sm">JPG or PNG supported</p>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    {image && (
                        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Prompt</label>
                                <input 
                                    type="text" 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                                    placeholder="Describe the video..."
                                />
                             </div>

                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Aspect Ratio</label>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setAspectRatio('16:9')}
                                        className={`flex-1 py-2 rounded-xl border font-medium text-sm transition-all ${
                                            aspectRatio === '16:9' ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                                        }`}
                                    >
                                        16:9 (Landscape)
                                    </button>
                                    <button 
                                        onClick={() => setAspectRatio('9:16')}
                                        className={`flex-1 py-2 rounded-xl border font-medium text-sm transition-all ${
                                            aspectRatio === '9:16' ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                                        }`}
                                    >
                                        9:16 (Portrait)
                                    </button>
                                </div>
                             </div>

                             {error && (
                                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
                                    {error}
                                </div>
                             )}

                             <button 
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-md shadow-violet-200 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating Video...
                                    </>
                                ) : (
                                    <>
                                        <Film className="w-5 h-5" />
                                        Generate Video
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Video Result */}
                    {videoUrl && (
                        <div className="mt-6 animate-in zoom-in duration-500">
                            <h3 className="text-sm font-semibold text-slate-700 mb-2">Generated Video</h3>
                            <div className="rounded-2xl overflow-hidden shadow-lg bg-black">
                                <video 
                                    controls 
                                    autoPlay 
                                    loop 
                                    src={videoUrl} 
                                    className="w-full h-auto max-h-96 object-contain mx-auto"
                                />
                            </div>
                            <div className="text-center mt-3">
                                <a 
                                    href={videoUrl} 
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center text-sm text-violet-600 hover:text-violet-700 font-medium hover:underline"
                                >
                                    Open Video in New Tab
                                </a>
                            </div>
                        </div>
                    )}
                </div>
             </div>
        </div>
    );
};

export default VeoModal;
