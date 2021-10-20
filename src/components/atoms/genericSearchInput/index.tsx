import React from 'react';
import styles from './genericSearchInput.module.scss'
import useDebounce from '../../../utils/deBounce';
import { MdSearch } from 'react-icons/md'

interface inputProps {
  value: string;
  setValue: any;
}

export default function GenericSearchInput({ value = '', setValue }: inputProps) {

  const debounceChange = useDebounce(() => { }, 1000)

  const changeValue = (e: any) => {
    const { target: { value } } = e

    setValue(value);
    debounceChange(value)
  }

  return (
    <div className={value ? styles.input : styles.inputEmpety}>
      <MdSearch size={22} color='#ffd239' className={styles.searchIcon} />
      <input
        id='search'
        type="text"
        autoComplete="off"
        placeholder="What are you search?"
        value={value}
        onChange={(e) => changeValue(e)}
      />
    </div>
  )
}