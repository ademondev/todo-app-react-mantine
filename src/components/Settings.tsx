import { BackgroundImage, Button, ColorInput, Divider, FileInput, Paper, Space, Title } from "@mantine/core";
import { FC, useState } from "react";
import MainContentPreview from "./MainContentPreview";
import { NotificationProps, showNotification } from '@mantine/notifications';

interface SettingsInterface { 
  setFileURL: React.Dispatch<React.SetStateAction<string | null>>
  fileURL: string | null
}

const notifications = {
  onFileError: {
    color: 'red',
    title: 'Error',
    message: 'The image could not load. Try again'
  },
  onFileSuccess: {
    color: 'green',
    title: 'Success!',
    message: 'The image loaded successfully'
  },
  onImageRemove: {
    color: 'green',
    title: 'Success!',
    message: 'The image was successfully removed'
  },
  onColorRemove: {
    color: 'green',
    title: 'Success!',
    message: 'The color was successfully removed'
  }
}

const Settings: FC<SettingsInterface> = ({ setFileURL, fileURL}) => {
    const [color, setColor] = useState<string>('');

    const fr = new FileReader();
    fr.onload = function (event) {
      if(typeof fr.result !== "string") throw new Error("FileReader$readAsDataURL did not generate a string");
      setFileURL(fr.result);
    };
    fr.onabort = () => console.log("aborted"); // no need to handle this
    fr.onerror = () => showNotification(notifications.onFileError); // should really handle this

    async function handleImageChange(payload: File | null): Promise<void> {
      if (payload === null) {
        setFileURL(null);
      }
      else {
        fr.abort(); // Abort whatever previous image the FileReader was reading
        fr.readAsDataURL(payload);
        showNotification(notifications.onFileSuccess);
      }
    }

    return (
        <div>
            <Divider my="md" label="Background" labelPosition="center" />
            <FileInput
                placeholder="Image (PNG, JPG)"
                label="Choose a background image"
                onChange={handleImageChange}
                accept="image/png,image/jpeg"
            />
            <Space h="sm" />
            <Button onClick={() => {
              setFileURL('');
              showNotification(notifications.onImageRemove);
            }}
            >
                Remove background image
            </Button>
            <Space h="md" />
            <ColorInput value={color} onChange={setColor} label="Or a color!"/>
            <Space h="sm" />
            <Button onClick={() => {
              setColor('');
              showNotification(notifications.onColorRemove);
            }}
            >
                Remove background color
            </Button>
            <Space h="sm" />
            <MainContentPreview 
              fileURL={fileURL === null ? '' : fileURL}
              color={color}
            />
        </div>
    );
}

export default Settings;