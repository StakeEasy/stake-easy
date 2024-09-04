import React from "react";
import { useDropzone, Accept, FileWithPath } from "react-dropzone";
// import { useDropzone, Accept } from "react-dropzone";

interface DropzoneProps {
  onDrop: (acceptedFiles: FileWithPath[]) => void;
  accept: Accept;
  open?: () => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onDrop, accept, open }) => {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    multiple: false,
    accept,
    onDrop,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  return (
    <div>
      <div {...getRootProps({ className: "dropzone" })}>
        <input className="input-zone" {...getInputProps()} />
        <div className="text-center">
          {isDragActive ? (
            <p className="dropzone-content">Release to drop the files here</p>
          ) : (
            <p className="dropzone-content">
              Drag’ n’ drop keystore file here, or click to select files
            </p>
          )}
          <button type="button" onClick={open} className="btn">
            Click to select files
          </button>
        </div>
      </div>
      <aside>
        <ul>{files}</ul>
      </aside>
    </div>
  );
};

export default Dropzone;