import React, { FC } from 'react';
import Dropzone from 'react-dropzone';
import styles from './dropZone.module.scss'
import GenericText from '../../atoms/genericText'


export default function DropZone({ onUpload }: { onUpload: any }) {

  const handleMessage = (isDragActive: boolean, isDragReject: boolean) => {
    if (!isDragActive) {
      return "Drag `n` drop some files here, or click to select files"
    }
    if (isDragReject) {
      return "File dont accepted"
    }
    return "Drop your files here!"
  }

  return (
    <Dropzone accept={'image/*'} onDropAccepted={onUpload} >
      {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
        <div
          className={styles[`dropContainer${isDragActive ? 'DragActive' : ''}${isDragReject ? 'DragReject' : ''}`]}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <GenericText>{handleMessage(isDragActive, isDragReject)}</GenericText>
        </div>
      )}
    </Dropzone >
  )
}

