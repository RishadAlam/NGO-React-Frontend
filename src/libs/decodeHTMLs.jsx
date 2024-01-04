export default function decodeHTMLs(value) {
  return <div dangerouslySetInnerHTML={{ __html: value }}></div>
}
