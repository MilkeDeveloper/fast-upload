"use client";


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabaseClient";
import { useMemo, useState } from "react";

export default function Upload() {

    const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

    const handleUpload = async (file: File) => {
    const { data, error } = await supabase.storage
        .from("video-upload")
        .upload(`public/${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
        });

    if (error) {
        console.error("Erro ao fazer upload:", error.message);
        return;
    }

    const videoUrl = `${PUBLIC_URL}/storage/v1/object/public/video-upload/public/${file.name}`;
    console.log("URL do vídeo:", videoUrl);
    // Aqui você pode salvar no estado, redirecionar, etc.
    };

    const [isDragging, setIsDragging] = useState(false)
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const videoUrl = useMemo(() => {
        return videoFile ? URL.createObjectURL(videoFile) : null;
    }, [videoFile]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (!file) return;

        // ⚠️ Validação aqui:
        if (!file.type.startsWith("video/")) {
            // mostra um erro, alerta, ou ignora
            alert("Por favor, envie um arquivo de vídeo.");
            return;
        }
        setVideoFile(file); // por enquanto assume que é vídeo
        console.log(videoFile)
        
    };



    return (
        <div>
            <div className="max-h-screen flex justify-center gap-2">
                <h1 className="pt-4 text-2xl text-green-500 font-bold">Fast</h1>
                <h1 className="pt-4 text-2xl text-zinc-200 font-bold">Upload</h1>

            </div>
            <div className="flex justify-center">
                <div className="w-[500px]">
                    <Separator className=" bg-green-800 mt-2"/>
                </div>

            </div>
            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                className="flex justify-center pt-7 pb-2">
                <Card className={` hover:bg-green-700/20  hover:text-white border-dashed text-gray-400 border-green-600 w-[500px] h-[380px] justify-center items-center 
                    transition-colors duration-200 ${
                    isDragging ? 'bg-green-300/20' : ' bg-zinc-800'
                    
                }`}>
                    <CardContent >
                        <span className={`${videoFile ? "hidden" : "block"}`}>Arraste e solte o video aqui!</span>
                        {videoUrl && (
                            <video src={videoUrl} controls className="w-full mt-4 rounded-md" />
                        )}
                    </CardContent>
                    
                    
                </Card>
                
            </div>
            
            
            <div className="flex justify-center pt-5">
                <Button onClick={() => videoFile && handleUpload(videoFile)} className="w-[500px] bg-green-600 hover:bg-green-700">
                    Upload
                </Button>
            </div>
            
        </div>

        
    )
}