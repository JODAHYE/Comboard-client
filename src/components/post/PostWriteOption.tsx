import axios from "axios";
import React, { RefObject } from "react";
import styled from "styled-components";
type PropsType = {
  contentField: RefObject<HTMLDivElement>;
  showCode: boolean;
  setShowCode: React.Dispatch<React.SetStateAction<boolean>>;
};

type StyleType = {
  active?: boolean;
};
const PostWriteOption: React.FC<PropsType> = ({
  contentField,
  showCode,
  setShowCode,
}) => {
  const onImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!contentField.current) return;
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    const formData = new FormData();
    formData.append("file", files[0]);
    const loadingNode = document.createTextNode("이미지 첨부중...");
    contentField.current.appendChild(loadingNode);
    const imgUrl = await axios
      .post(`/upload/image`, formData)
      .then((res) => res.data.img_url);
    console.log(imgUrl);
    const imgTag = document.createElement("img");
    imgTag.setAttribute("src", imgUrl);
    imgTag.style.width = "50%";
    contentField.current.appendChild(imgTag);
    contentField.current.removeChild(loadingNode);
  };

  const onVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!contentField.current) return;
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    const formData = new FormData();
    formData.append("file", files[0]);
    const loadingNode = document.createTextNode(
      "동영상 첨부중... 시간이 걸립니다."
    );
    contentField.current.appendChild(loadingNode);
    const videoUrl = await axios
      .post(`/upload/video`, formData)
      .then((res) => res.data.video_url);
    console.log(videoUrl);
    const embedTag = document.createElement("embed");
    embedTag.setAttribute("src", videoUrl);
    embedTag.style.maxWidth = "90%";
    embedTag.style.height = "300px";
    contentField.current.appendChild(embedTag);
    contentField.current.removeChild(loadingNode);
  };

  const onClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const target = e.target as HTMLImageElement;
    if (!contentField.current) return;
    console.log(target.dataset);
    if (target.dataset.name === "addLink") {
      console.log("link");
      let url = prompt("링크를 추가하세요.", "");
      if (!url) return;
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.innerText = url;
      contentField.current.appendChild(a);
    }

    if (target.dataset.name === "toCode") {
      console.log("toCode");
      if (!contentField.current.textContent || !contentField.current.innerHTML)
        return;
      if (!showCode) {
        contentField.current.textContent = contentField.current.innerHTML;
        //textContent 속성은 노드와 그 자손의 텍스트 콘텐츠를 표현합니다
      } else {
        //innerHTML 은 요소(element) 내에 포함 된 HTML 또는 XML 마크업을 가져오거나 설정
        contentField.current.innerHTML = contentField.current.textContent;
      }
      setShowCode((prev) => !prev);
    }
  };
  return (
    <Option>
      <Icon
        src="../../../icon/link.svg"
        data-name="addLink"
        onClick={onClick}
        title="링크 추가"
      />

      <form>
        <label data-name="addImage" title="이미지 첨부" htmlFor="image">
          <Icon src="../../../icon/image.svg" />
        </label>
        <ImgUpload
          type="file"
          id="image"
          name="bgimg"
          accept="image/*"
          onChange={onImgChange}
        />
      </form>

      <form>
        <label data-name="addImage" title="동영상 첨부" htmlFor="video">
          <Icon src="../../../icon/film.svg" />
        </label>
        <ImgUpload
          type="file"
          id="video"
          name="bgimg"
          accept="video/*"
          onChange={onVideoChange}
        />
      </form>
      <Icon
        src="../../../icon/embed2.svg"
        data-name="toCode"
        onClick={onClick}
        title="html로 작성"
        active={showCode ? true : undefined}
      />
    </Option>
  );
};

export default PostWriteOption;
const Option = styled.div`
  width: 100%;
  border-left: 1px solid ${(props) => props.theme.colors.shadow};
  border-right: 1px solid ${(props) => props.theme.colors.shadow};
  ${(props) => props.theme.displayFlex}
  gap: 4px;
  & > form {
    width: 30px;
    height: 30px;
  }
`;

const ImgUpload = styled.input`
  display: none;
`;
const Icon = styled.img<StyleType>`
  width: 30px;
  height: 30px;
  object-fit: cover;
  display: inline-block;
  background: ${(props) =>
    props.active ? props.theme.colors.buttonActive : props.theme.colors.button};
  color: #fff;
  padding: 6px;
  z-index: 100;
  cursor: pointer;
  &:active {
    background: ${(props) => props.theme.colors.buttonActive};
  }
`;
