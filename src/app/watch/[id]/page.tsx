"use client";

import dynamic from "next/dynamic";

import { Separator } from "@/components/ui/separator";
// This is a dynamic import for the Plyr component to ensure it only loads on the client side
const Plyr = dynamic(() => import("plyr-react"), { ssr: false });
import "plyr-react/plyr.css";
import axios from "axios";
import dotenv from "dotenv";
import { use } from "react";
import React, { useEffect, useState, useMemo } from "react";
import { DownloadIcon, EyeIcon, Share2Icon } from "lucide-react";
import { getSocket } from "@/utils/socket";
//import { io } from "socket.io-client";

dotenv.config();


interface PageProps {
  params: Promise<{ id: string }>;
}

interface VideoData {
    id: string;
    title: string;
    url: string;
    views: number;
    createdAt: string;
    // Add other properties as needed based on your API response
}




export default function WatchVideo({ params }: PageProps) {
    // Extract the video ID from the URL parameters
    const { id } = use(params);

    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [videoViews, setVideoViews] = useState(0)
    const [isVertical, setIsVertical] = useState(false);

  

    useEffect(() => {
        const fetchVideoData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/videos/${id}`);
            setVideoData(response.data.video); // ← Pega o objeto dentro de "video"
            //setVideoViews(response.data.views)
            console.log("Video data fetched:", response.data.video);
        } catch (error) {
            console.error("Erro ao buscar vídeo:", error);
        }
        };

        fetchVideoData();
    }, [id]);


    

    useEffect(() => {
        const temp = document.createElement("video");
        temp.src = videoData ? videoData.url : "";
        temp.onloadedmetadata = () => {
        const ratio = temp.videoWidth / temp.videoHeight;
        setIsVertical(ratio < 0.8); // Se for muito alto, é vertical
        };
    }, [videoData]);


    


    useEffect(() => {

        const socket = getSocket()
        console.log(socket)

        interface ViewUpdatedData {
            id: string;
            views: number;
        }

        function handleViewUpdated(data: ViewUpdatedData) {
            if (data.id === id) {
                setVideoViews(data.views);
            }
        }

        socket.on('connect', () => {
            console.log('socket conectado com ID:', socket.id);

            socket.emit('videoViewed', { id });
            console.log('id do video emitido:', id);
        });

        socket.on('viewCountUpdate', handleViewUpdated)

        return () => {
            socket.off('viewCountUpdate', handleViewUpdated);
            socket.disconnect();
        };

    }, [id])

    // prevents player re-render
    const memoizedPlayer = useMemo(() => {
        return (
            <Plyr
            source={{
                type: "video",
                sources: [
                {
                    src: videoData?.url || "",
                    provider: "html5",
                },
                ],
            }}
            options={{
                ratio: isVertical ? "9:16" : "16:9",
                clickToPlay: true,
                controls: [
                "play-large",
                "play",
                "progress",
                "current-time",
                "mute",
                "volume",
                "captions",
                "settings",
                "pip",
                "fullscreen",
                ],
            }}
            />
        );
        }, [videoData?.url, isVertical]);


    return (
        <div className="min-h-[90vh] flex flex-col items-center min-w-screen px-6">
            <div className="max-h-screen flex gap-2">
                <h1 className="pt-4 text-2xl text-green-500 font-bold">Fast</h1>
                <h1 className="pt-4 text-2xl text-zinc-200 font-bold">Upload</h1>

            </div>
            {videoData && videoData.url && isVertical !== null ? ( <div className="flex flex-col items-center w-full text-zinc-300">
                <div className="w-full text-center min-w-screen px-12">
                    <Separator className=" mt-2 mb-4 bg-green-800" />
                    <h1 className="mt-8 text-sm md:text-lg lg:text-xl 2xl:text-2xl text-zinc-200 font-bold">
                        {videoData && videoData.title ? videoData.title : "Loading..."}
                    </h1>
                </div>
                
                { videoData && isVertical !== null && (<div className={`min-w-[80vw]  ${isVertical ? "md:min-w-[20vw] 2xl:min-h-[680px]" : "2xl:min-w-[60vw]"}  mt-4 border-2 border-green-500 rounded-3xl overflow-hidden`}>
                    {memoizedPlayer}
                </div>)}

                <div className={`my-3 flex justify-between min-w-full ${isVertical ? "2xl:min-w-[20vw] px-8" : "2xl:min-w-[60vw] px-8"}`}>
                    <div className="flex gap-x-2">
                        <EyeIcon className="w-5 h-5 2xl:w-7 2xl:h-7 text-green-700" />
                        <span className="2xl:mt-[1px] -mt-[1px] text-zinc-400 font-bold">{videoViews}</span>
                        
                    </div>
                    
                    <Share2Icon className="w-5 h-5 2xl:w-7 2xl:h-7 mr-6 text-green-700" />
                    <a href={videoData?.url} download={videoData?.url}>
                        <DownloadIcon className="w-5 h-5 2xl:w-7 2xl:h-7 text-green-700" />
                        
                    </a>
                </div>

            </div>) : 
            ( <div className=" flex flex-col justify-center items-center w-full h-[75vh] text-zinc-300 text-center"> 
                <span className="text-sm text-green-500 -mt-2 loading loading-spinner">Loading...</span>
                <span className="text-sm font-bold text-green-500 mt-2">Carregando...</span>
            </div> ) }
            
        </div>
    );
}


