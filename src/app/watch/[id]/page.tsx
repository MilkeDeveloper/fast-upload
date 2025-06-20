"use client";

import dynamic from "next/dynamic";

import { Separator } from "@/components/ui/separator";
// This is a dynamic import for the Plyr component to ensure it only loads on the client side
const Plyr = dynamic(() => import("plyr-react"), { ssr: false });
import "plyr-react/plyr.css";

interface PageProps {
  params: { id: string }
}

export default function WatchVideo({params}: PageProps) {
    return (
        <div className="min-h-[90vh] flex flex-col items-center min-w-screen px-6">
            
            <div className="max-h-screen flex gap-2">
                <h1 className="pt-4 text-2xl text-green-500 font-bold">Fast</h1>
                <h1 className="pt-4 text-2xl text-zinc-200 font-bold">Upload</h1>

            </div>
            <div className="w-full text-center min-w-screen px-12">
                <Separator className=" mt-2 mb-4 bg-green-800" />
                <h1 className="mt-8 text-sm md:text-lg lg:text-xl 2xl:text-2xl text-zinc-200 font-bold">Thornhill - Joy.mp4</h1>

            </div>
            
            <div className="min-w-[90vw] 2xl:min-w-[60vw] mt-4 border-2 border-green-500 rounded-3xl overflow-hidden">
                <Plyr
                    source={{
                        type: "video",
                        sources: [
                            {
                                src: "https://www.dropbox.com/scl/fi/dbj8ibv49d8umby052j28/2f7d1ca0-da26-4f16-a86c-be3100c740fa_Joy1.mp4?rlkey=1smx7s3l0rmug7mworrg6zix1&raw=1",
                                provider: "html5",
                            },
                        ],
                    }}
                    options={{
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

                
            </div>
            
        </div>
            
    );
    
}

