"use client"

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Trash } from 'lucide-react';
import Image from 'next/image';
import Webcam from 'react-webcam';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { cn } from '@/lib/utils';

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

  const webcamRef = useRef<Webcam>(null);

  const [open, setOpen] = useState(false)

  const [deviceId, setDeviceId] = useState('');

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const handleDevices = useCallback(
    (mediaDevices: MediaDeviceInfo[]) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  useEffect(
    () => {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
    },
    [handleDevices]
  );

  const [isMounted, setIsMounted] = useState(false);

  const retake = () => {
    onRemove(value);
  };

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onSave(imageSrc);
    }

  }

  useEffect(() => {
    setIsMounted(true);
  }, [])


  if (!isMounted) {
    return null;
  }

  return (
    <>
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
            videoConstraints={{ deviceId: deviceId }}
          />
        )}
        {!value &&
          <div className='flex flex-col gap-2'>
            <Button
              disabled={disabled}
              variant={'outline'}
              onClick={capture}>
              Capture photo
            </Button>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                >
                  {value
                    ? devices.find((device) => device.deviceId === value)?.label
                    : "Select webcam..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandInput placeholder="Search webcam..." />
                  <CommandEmpty>No webcam found.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {devices.map((device, key) => (
                        <CommandItem
                          key={key}
                          value={device.deviceId}
                          onSelect={(currentValue) => {
                            setDeviceId(currentValue === value ? "" : currentValue)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === device.deviceId ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {device.label}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        }
      </div>
    </>
  )
};

export default CustomWebcam