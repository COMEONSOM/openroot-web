/// <reference types="vite/client" />

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";
declare module "*.webp";

declare module "*.mp4";
declare module "*.webm";

declare module "*.json" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any;
  export default value;
}
