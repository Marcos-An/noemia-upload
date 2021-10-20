import React, { useState, useEffect } from 'react'
import styles from './home.module.scss'
import ContentContainer from '../components/atoms/contentContainer'
import GenericSearchInput from '../components/atoms/genericSearchInput'
import Dropzone from '../components/molecules/dropZone'
import FileList from '../components/organisms/fileList'
import * as _ from "lodash"
import prettyBytes from 'pretty-bytes'
import api from '../services/api'
import 'react-circular-progressbar/dist/styles.css'
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


export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<Array<FileProps>>([])
  const [filesFiltredSearch, setFilteredSearch] = useState<Array<FileProps>>([])
  const [search, setSearch] = useState<string>('')


  var currentUploadedFiles: any[]

  useEffect(() => {
    api.get('/posts').then((posts: any) => {
      const newUploadedFiles = posts.data.map((file: any) => {
        const newFile = {
          file,
          id: file._id,
          name: file.name,
          readableSize: prettyBytes(file.size),
          preview: file.url,
          progress: 0,
          uploaded: true,
          error: false,
          url: file.url
        }

        return newFile
      })
      setUploadedFiles(newUploadedFiles)
    })
  }, [])

  const handleUpload = (files: Array<any>) => {
    const newUploadedFiles = files.map(file => ({
      file,
      id: _.uniqueId(),
      name: file.name,
      readableSize: prettyBytes(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null
    }))

    currentUploadedFiles = [...uploadedFiles, ...newUploadedFiles]

    setUploadedFiles([...currentUploadedFiles])

    currentUploadedFiles.forEach((file) => {
      if (uploadedFiles.indexOf(file) === -1) {
        procesUpload(file)
      }
    })
  }

  const updateFile = async (id: string, data: any) => {
    const newUploadedFiles = currentUploadedFiles.map((file: FileProps) => {
      if (file.id === id) {
        file = { ...file, ...data }

        return file
      }
      return file
    })

    currentUploadedFiles = newUploadedFiles
    setUploadedFiles([...newUploadedFiles])
  }

  const procesUpload = (file: FileProps) => {
    const data = new FormData()

    console.log(file)
    data.append('file', file.file, file.name)


    api.post('/posts', data, {
      onUploadProgress: e => {
        const progress = Math.round((e.loaded * 100) / e.total)

        updateFile(file.id, { progress: progress })
      }
    }).then((response: any) => {
      updateFile(file.id, {
        uploaded: true,
        id: response.data._id,
        url: response.data.url
      })
    }).catch(() => {
      updateFile(file.id, { error: true })
    })
  }


  const handleDeleteFile = async (id: string) => {
    await api.delete(`/posts/${id}`)

    const newUploadedFiles = uploadedFiles.filter(file => file.id !== id)

    setUploadedFiles(newUploadedFiles)
  }

  useEffect(() => {
    const lowerCaseValue = search.toLowerCase()

    const filesFilered = uploadedFiles.filter((file) => {
      if (file.name.toLowerCase().includes(lowerCaseValue)) {
        return file
      }
    })

    setFilteredSearch(filesFilered)
  }, [search])

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src='/logo.png'
          alt="logo"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <ContentContainer>
        <Dropzone onUpload={handleUpload} />
      </ContentContainer>
      <div className={styles.contentContainer}>
        <GenericSearchInput
          value={search}
          setValue={setSearch}
        />
        {!!uploadedFiles.length && search === '' &&
          <FileList files={uploadedFiles} handleDeleteFile={handleDeleteFile}
          />
        }
        {!!filesFiltredSearch.length && search !== '' &&
          <FileList files={filesFiltredSearch} handleDeleteFile={handleDeleteFile} />
        }
        {
          !!!filesFiltredSearch.length && !!!uploadedFiles.length &&
          <h2>No files have been uploaded yet.</h2>
        }
      </div>
    </div>
  )
}