import React, { useState } from 'react';
import styles from './fileInfo.module.scss'
import { CircularProgressbar } from 'react-circular-progressbar';
import { MdCheckCircle, MdError, MdLink } from 'react-icons/md'
import Image from 'next/image'

interface FileProps {
  file: any;
  id: string;
  name: any;
  readableSize: string;
  preview: string;
  progress: number;
  uploaded: boolean;
  error: boolean;
  url: null;
}

interface Props {
  files: Array<FileProps>;
  handleDeleteFile: any;
}

export default function FileList({ files, handleDeleteFile }: Props) {

  return (
    <div className={styles.container}>
      <div className={styles.gridContainer}>
        {files.map(file => (
          <li key={file.id} className={styles.fileList}>
            <div className={styles.fileInfoWrapper}>
              <div className={styles.imageContainer}>
                <Image
                  src={file.preview}
                  alt="Picture of the author"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className={styles.fileInfo}>
                <strong>{file.name}</strong>
                <span>
                  {file.readableSize} {!!file.url && <button onClick={() => handleDeleteFile(file.id)}>Excluir</button>}</span>
              </div>
            </div>

            <div className={styles.icons}>
              {!file.uploaded && !file.error &&
                <CircularProgressbar
                  styles={{
                    root: { width: 20 },
                    path: { stroke: '#ffd239' }
                  }}
                  strokeWidth={10}
                  value={file.progress}
                />
              }

              {file.url && <a href={`${file.url}`} target="_blank" rel="noopener noreferrer">
                <MdLink size={20} />
              </a>}

              {file.uploaded && <MdCheckCircle size={20} color="#78e5d5" />}

              {file.error && <MdError size={20} color="#e57878" />}
            </div>
          </li>
        ))}
      </div>
    </div>
  )
}