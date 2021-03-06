import React, { RefObject } from "react";
import styled, { keyframes } from "styled-components";

import UploadAPI from "../../lib/api/UploadAPI";

type PropsType = {
  contentField: RefObject<HTMLDivElement>;
  showCode: boolean;
  uploadLoading: boolean;
  setUploadLoading: any;
  setShowCode: React.Dispatch<React.SetStateAction<boolean>>;
};

type StyleType = {
  isActive?: boolean;
};

const PostWriteOption = ({
  contentField,
  showCode,
  uploadLoading,
  setUploadLoading,
  setShowCode,
}: PropsType) => {
  const onImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!contentField.current) return;
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    const formData = new FormData();
    setUploadLoading(true);
    formData.append("file", files[0]);
    const imgUrl = await UploadAPI.imageUpload(formData);
    const imgTag = document.createElement("img");
    imgTag.setAttribute("src", imgUrl);
    imgTag.style.maxWidth = "80%";
    contentField.current.appendChild(imgTag);
    setUploadLoading(false);
  };

  const onVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!contentField.current) return;
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    const formData = new FormData();
    setUploadLoading(true);
    formData.append("file", files[0]);
    const textNode = document.createTextNode(".");
    const videoUrl = await UploadAPI.videoUpload(formData);
    const videoTag = document.createElement("video");
    videoTag.setAttribute("controls", "true");
    videoTag.setAttribute("src", videoUrl);
    videoTag.style.maxWidth = "80%";
    contentField.current.appendChild(videoTag);
    contentField.current.appendChild(textNode);
    setUploadLoading(false);
  };

  const onClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const target = e.target as HTMLImageElement;
    if (!contentField.current) return;
    if (target.dataset.name === "addLink") {
      let url = prompt("????????? ???????????????.", "");
      if (!url) return;
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.innerText = url;
      contentField.current.appendChild(a);
    }
    if (target.dataset.name === "toCode") {
      if (!contentField.current.textContent || !contentField.current.innerHTML)
        return;
      if (!showCode) {
        contentField.current.textContent = contentField.current.innerHTML;
      } else {
        contentField.current.innerHTML = contentField.current.textContent;
      }
      setShowCode((prev) => !prev);
    }
  };

  return (
    <Option>
      {uploadLoading && (
        <LoadingIcon src="../../../icon/loading.svg" alt="????????????" />
      )}
      {!uploadLoading && (
        <>
          <Icon
            src="../../../icon/link.svg"
            data-name="addLink"
            onClick={onClick}
            title="?????? ??????"
          />
          <form>
            <label data-name="addImage" title="????????? ??????" htmlFor="image">
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
            <label data-name="addImage" title="????????? ??????" htmlFor="video">
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
            title="html??? ??????"
            isActive={showCode ? true : false}
          />
        </>
      )}
    </Option>
  );
};

const rotateAny = keyframes`
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
`;

const Option = styled.div`
  width: 100%;

  ${(props) => props.theme.displayFlex};
  gap: 4px;

  border-left: 1px solid ${(props) => props.theme.colors.shadow};
  border-right: 1px solid ${(props) => props.theme.colors.shadow};
  & > form {
    width: 30px;
    height: 30px;
  }
`;

const LoadingIcon = styled.img`
  width: 30px;
  animation: ${rotateAny} 3s linear infinite;
`;

const ImgUpload = styled.input`
  display: none;
`;

const Icon = styled.img<StyleType>`
  width: 30px;
  height: 30px;
  display: inline-block;

  object-fit: cover;
  background: ${(props) =>
    props.isActive
      ? props.theme.colors.buttonActive
      : props.theme.colors.button};

  padding: 6px;
  z-index: 100;
  cursor: pointer;

  &:active {
    background: ${(props) => props.theme.colors.buttonActive};
  }
`;

export default PostWriteOption;
