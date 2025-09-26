import style from './fileUploadBox.module.css'
import uploadIcon from '@/assets/image/upload.svg'
import Button from '../../Button/button'

export default function FileUploadBox(){
    return(
        <div className={style.boxContainer}>
            <img src={uploadIcon} alt="upload-icon"/>
            <div className={style.content}>
                <div className={style["upload-instruction"]}>문서를 드래그 또는 업로드해주세요</div>
                <Button
                color="white"
                backgroundColor="#ff5525"
                content="파일 선택하기"
                onClick={()=>{}}
                />
                <div className={style.fileLimit}>지원형식 : PDF, JPG, PNG, DOC, DOCX (최대 10MB)</div>
            </div>
        </div>
    )
}