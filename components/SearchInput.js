import { css } from '@emotion/css'

export function SearchInput({
  placeholder, onChange, value, onKeyDown = null
}) {
  return (
    <input
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={inputStyle}
      onKeyDown={onKeyDown}
    />
  )
}

const inputStyle = css`
  outline: none;
  border: none;
  padding: 15px 20px;
  font-size: 16px;
  border-radius: 25px;
  border: 0.5px solid gray;
  transition: all .4s;
  width: 300px;
  background-color: white;
  color: black;
`
