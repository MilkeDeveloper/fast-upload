"use client";


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import axios, { AxiosProgressEvent } from "axios";
import { Copy, PlusCircle, Trash2Icon } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import dotenv from "dotenv";

dotenv.config();

export default function Upload() {
    // Estados para controlar o upload
    const [isDragging, setIsDragging] = useState(false)
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [sharedUrl, setSharedUrl] = useState<string>();
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [uploading, setUploading] = useState(false);
    const [openmodal, setOpenmodal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [customizedUrl, setCustomizedUrl] = useState("");
    const inputRef = useRef(null);

    
    async function saveVideoFile(title: string, url: string) {
        // Aqui você pode implementar a lógica para salvar o vídeo no banco de dados ou onde for necessário
        
        // Exemplo de chamada de API para salvar o vídeo
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/videos`, {
                title: title,
                url: url
            });
            if (res.data.success) {

                const videoID = res.data.video.id // Supondo que o ID do vídeo seja retornado na resposta
                console.log("Vídeo salvo com sucesso:", res.data.video.id);
                setCustomizedUrl(`https://fast-upload-black.vercel.app//watch/${videoID}`) // URL para ser compartilhada
                toast.success("Vídeo salvo com sucesso!");
                return res.data; // Retorna o vídeo salvo
            }       
        } catch (error) {
            console.error("Erro ao salvar o vídeo:", error);
            setModalMessage("Erro ao salvar o vídeo. Tente novamente mais tarde.");
            setOpenmodal(true);
            return null; // Retorna null em caso de erro
        }
    }
    


    const handleUpload = async () => {
        if (!videoFile) return

        const formData = new FormData()
        formData.append('file', videoFile)

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (event: AxiosProgressEvent) => {
                    const total = event.total || 1
                    const percent = Math.round((event.loaded * 100) / total)
                    setUploadProgress(percent)
                    setSharedUrl("") // Limpa o link compartilhado enquanto faz o upload
                    setUploading(true); // Define que está fazendo o upload
                }
            })
            


            if (res.data.success) {
                const sharedUrl = res.data.url
                const rawUrl = sharedUrl.split('dl=0')[0] + 'raw=1'
                saveVideoFile(videoFile.name, rawUrl) // Salva o vídeo no banco de dados
                console.log("url de compartilhamento: ", customizedUrl)
                console.log(res.data, videoFile.name)
                setUploadProgress(0) // Reseta progresso após o upload
                setUploading(false); // Define que o upload foi concluído
                setVideoFile(null) // Limpa o arquivo de vídeo após o upload
                
            } else {
                alert('Falha no upload')
            }

        } catch (err) {
            console.error('Erro no upload', err)
            setModalMessage('Erro ao enviar o vídeo. Tente novamente mais tarde.');
            setOpenmodal(true);
            setUploadProgress(0); // Reseta progresso em caso de erro
            setUploading(false); // Define que o upload falhou
            setVideoFile(null); // Limpa o arquivo de vídeo em caso de erro
            return;
        }
    }

    
        
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (videoFile) return; // Se já tiver um vídeo, não substitui
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
        if (videoFile) return; // Se já tiver um vídeo, não substitui

        // ⚠️ Validação aqui:
        if (!file.type.startsWith("video/")) {
            // mostra um erro, alerta, ou ignora
            setModalMessage("Por favor, selecione um arquivo de vídeo válido.");
            setOpenmodal(true);
            return;
        }
        setVideoFile(file); // por enquanto assume que é vídeo
        setUploading(false); // Reseta o estado de upload
        console.log(videoFile) 
    };

    const handleCardClick = () => {
        // Simula o clique no input de arquivo
        if (uploading) return; // Não permite clicar se já estiver fazendo upload
        if (videoFile) return; // Não permite clicar se já tiver um vídeo selecionado
        if (inputRef.current) {
            (inputRef.current as HTMLInputElement).click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const file = files[0];
        // ⚠️ Validação aqui:
        if (!file.type.startsWith("video/")) {
            // mostra um erro, alerta, ou ignora
            setModalMessage("Por favor, selecione um arquivo de vídeo válido.");
            setOpenmodal(true);
            return;
        }
        // Faça algo com o arquivo selecionado
        setVideoFile(file);
        setUploading(false); // Reseta o estado de upload
        console.log(file);
        // Se quiser limpar o input após selecionar o arquivo
        e.target.value = ''; // Limpa o input após selecionar o arquivo
    };

    const handleDeleteVideo = () => {
        setVideoFile(null);
        setSharedUrl("");
        setUploadProgress(0);
        setUploading(false);
    };

    return ( 
        <>
            <div className="">
                <div className="max-h-screen flex justify-center gap-2">
                    <h1 className="pt-4 text-2xl text-green-500 font-bold">Fast</h1>
                    <h1 className="pt-4 text-2xl text-zinc-200 font-bold">Upload</h1>

                </div>
                <div className="flex justify-center w-full min-w-screen px-6">
                    <div className="w-[500px]">
                        <Separator className=" bg-green-800 mt-2"/>
                    </div>

                </div>
                <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                    className="flex justify-center pt-7 pb-2 w-full h-full px-6">
                    <Card className={`cursor-pointer hover:text-gray-400 border-dashed text-gray-400 border-green-600 w-[500px] h-[380px] justify-center items-center 
                        transition-colors duration-200 ${
                        isDragging ? 'bg-green-700/20' : ' bg-zinc-800'
                        
                    }`}>
                        
                        <CardContent onClick={handleCardClick} className="w-full h-full flex flex-col justify-center items-center">

                            <Input 
                                onChange={handleFileChange} 
                                ref={inputRef} 
                                type="file" 
                                placeholder="Cole o link do vídeo aqui"
                                className="h-full w-full hidden"
                            />
                            {!videoFile && (<PlusCircle className=" w-14 h-14 font-extralight text-zinc-700 mb-4 cursor-pointer hover:text-zinc-600 transition-colors duration-200" />)}
                            {!videoFile && (
                            <span className={`${videoFile ? "hidden" : "block"} text-center`}>
                                Arraste e solte o vídeo aqui
                                <br />
                                ou clique para selecionar.
                            </span>
                            
                        )}
                            
                            
                            {videoFile && !uploadProgress && (
                                <video
                                key={videoFile.name}
                                src={URL.createObjectURL(videoFile)}
                                controls
                                className="w-full rounded-md border border-green-600 mb-4"
                                />
                            )}

                            <div className=" flex flex-col justify-center items-center w-full">
                                {uploadProgress > 0 && uploadProgress < 100 && (
                                    <Progress getValueLabel={value => `${value}%`} value={uploadProgress} className="mt-4 w-[250px] h-2 text-white" />
                                )}

                                {uploadProgress > 0 && (
                                    
                                    <span className="text-sm mt-2 text-gray-400">
                                        {uploadProgress > 0 && uploadProgress < 100 && `Enviando: ${uploadProgress}%`}
                                    </span>   
                                )}


                                {uploadProgress === 100 && !sharedUrl && (
                                    <span className="text-sm text-green-600 -mt-2 loading loading-spinner"> </span>
                                )}

                                {uploadProgress === 100 && !sharedUrl && (
                                    <span className="text-md font-bold mt-4 text-green-500">
                                        Gerando link de visualização...
                                    </span>
                                )}

                                {videoFile && uploadProgress === 0 && (
                                    <span className="text-sm font-bold mt-4 text-gray-400">
                                        {videoFile.name} - {Math.round(videoFile.size / 1024)} KB
                                    </span>
                                )}
                                

                            </div>
        
                        </CardContent>
                        
                    </Card>
                    
                </div>

                

                <Dialog open={openmodal} onOpenChange={setOpenmodal}>
                    <DialogContent className="bg-zinc-800 text-zinc-400 border-0 border-green-600 focus:ring-0">
                        <DialogTitle className="text-md font-bold">
                            Atenção!
                        </DialogTitle>
                            <p className="text-sm text-zinc-400 mt-2">
                                {modalMessage}
                            </p>
                        <DialogFooter className="flex justify-center items-center gap-4 pt-4">
                            <DialogClose asChild>
                                <Button
                                    className="font-bold w-[100px] bg-pink-700 hover:bg-pink-900 hover:text-zinc-200 transition-150 ease-in-out active:scale-95">
                                    Fechar
                                </Button>
                            </DialogClose>
                        </DialogFooter>

                    </DialogContent>
                </Dialog>

                <div className="">
                    {uploading || videoFile && (
                    <div className="w-full min-w-screen md:flex 2xl:flex block items-center justify-center px-6 space-y-4 md:space-y-0 pt-5 gap-4 ">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    disabled={uploading || !videoFile}
                                    onClick={() => videoFile} 
                                    className=" cursor-pointer 2xl:w-[240px] md:w-[240px] w-full bg-green-600 hover:bg-green-700 hover:text-zinc-400 transition-150 ease-in-out active:scale-95">
                                    Upload
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-800 text-zinc-400 border-0 border-green-600 focus:ring-0">
                                <DialogTitle className="text-md font-bold">
                                    Tem certeza que deseja enviar este vídeo?
                                </DialogTitle>
                                
                                
                                <DialogFooter className="flex justify-center items-center gap-4 pt-4">
                                    <DialogClose asChild>
                                        <Button
                                            disabled={uploading || !videoFile}
                                            className="font-bold w-[100px] bg-pink-700 hover:bg-pink-900 hover:text-zinc-200 transition-150 ease-in-out active:scale-95">
                                            Cancelar
                                        </Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        
                                        <Button
                                            disabled={uploading || !videoFile}
                                            onClick={() => {
                                                handleUpload();
                                            }}
                                            className="w-[100px] bg-green-600 hover:bg-green-700 hover:text-zinc-200 transition-150 ease-in-out active:scale-95">
                                            Confirmar
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button
                            disabled={uploading || !videoFile}
                            onClick={() => videoFile && handleDeleteVideo()} 
                            className=" 2xl:w-[240px] md:w-[240px] w-full cursor-pointer bg-transparent hover:bg-transparent border-1 border-pink-700 hover:border-pink-900 text-pink-700 hover:text-pink-900 transition-150 ease-in-out active:scale-95 rounded-sm">
                            <Trash2Icon className="w-6 h-6  font-extrabold" />
                        </Button>
                        
                    </div>)}

                    <div className="flex justify-center pt-8 text-xl text-white font-bold h">
                    {customizedUrl && !videoFile && ( <span>Link gerado: </span> )}        
                    </div>

                    <div className="flex justify-center items-center pt-2 px-6">
                        {customizedUrl && !videoFile && ( <Card className="flex justify-center w-[720px] xs:w-1/3 max-w-[720px] h-[42px] relative bg-zinc-800 border border-green-600  transition-colors duration-200">
                            <input 
                            value={customizedUrl} 
                            readOnly
                            onFocus={e => e.target.select()}
                            placeholder="Link de compartilhamentro gerado." 
                            className="h-[38px] pr-10 pl-4 2xl:pr-2 selection:bg-green-600/30 outline-none text-center text-zinc-400 2xl:w-[680px] bg-transparent rounded-md">
                                
                            </input>
                            <Copy className="absolute right-2 cursor-pointer text-green-700 hover:text-green-400"
                                onClick={() =>  { toast.success("Link copiado para a área de transferência!")
                                    navigator.clipboard.writeText(customizedUrl);
                                }} />
                        </Card>
                            
                        )}
                    </div>
                
                </div>
                
                
            </div>
            
        </>
        
    )
    
}
