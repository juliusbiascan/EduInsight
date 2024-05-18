"use client"

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import Webcam from 'react-webcam';

interface CustomWebcamProps {
  disabled?: boolean;
  onSave: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
}

const CustomWebcam: React.FC<CustomWebcamProps> = ({
  disabled,
  onSave,
  onRemove,
  value
}) => {

  const webcamRef = useRef(null);

  const [isMounted, setIsMounted] = useState(false);

  const retake = () => {
    onRemove(value);
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onSave(imageSrc);
  }

  useEffect(() => {
    setIsMounted(true);
  }, [])


  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className='mb-4 flex flex-col gap-4'>
        {value ? (
          <div className='relative w-[300px] h-[200px] rounded-md overflow-hidden'>
            <div className='z-10 absolute top-2 right-2'>
              <Button type='button' onClick={retake} variant="destructive" size="icon">
                <Trash className='w-4 h-4' />
              </Button>
            </div>
            <Image fill className='object-cover' alt='Image' src={value} />
          </div>
        ) : (
          <Webcam
            height={300}
            width={300}
            ref={webcamRef}
            mirrored={true}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.8}
            videoConstraints={{
            }} />
        )}
        <div className='grid grid-cols-2 items-center gap-8'>
          {!value && <Button disabled={disabled} variant={'outline'} onClick={capture}>Capture photo</Button>}
        </div>
      </div>
    </div>
  )
};

export default CustomWebcam