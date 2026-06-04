import { LANGUAGES } from '../../utils/constants'

export default function LanguageSelector({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-field cursor-pointer"
      style={{ background: '#111118' }}>
      <option value="" disabled>Select language...</option>
      {LANGUAGES.map((lang) => (
        <option key={lang} value={lang}>{lang}</option>
      ))}
    </select>
  )
}
