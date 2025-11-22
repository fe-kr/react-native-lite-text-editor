import type { HTMLElementTag } from 'react-native-lite-text-editor';

export interface Option<V = string> {
  name?: string;
  value: V;
}

export const colorOptions: Option[] = [
  { name: 'Black', value: 'rgb(0, 0, 0)' },
  { name: 'Dark Gray', value: 'rgb(77, 77, 77)' },
  { name: 'Gray', value: 'rgb(153, 153, 153)' },
  { name: 'Light Gray', value: 'rgb(230, 230, 230)' },
  { name: 'White', value: 'rgb(255, 255, 255)' },
  { name: 'Red', value: 'rgb(230, 77, 77)' },
  { name: 'Orange', value: 'rgb(230, 153, 77)' },
  { name: 'Yellow', value: 'rgb(230, 230, 77)' },
  { name: 'Lime Green', value: 'rgb(153, 230, 77)' },
  { name: 'Green', value: 'rgb(77, 230, 77)' },
  { name: 'Sea Green', value: 'rgb(77, 230, 153)' },
  { name: 'Cyan', value: 'rgb(77, 230, 230)' },
  { name: 'Sky Blue', value: 'rgb(77, 153, 230)' },
  { name: 'Blue', value: 'rgb(77, 77, 230)' },
  { name: 'Purple', value: 'rgb(153, 77, 230)' },
] as const;

export const headingOptions: Option<HTMLElementTag>[] = [
  { name: 'Heading 1', value: 'h1' },
  { name: 'Heading 2', value: 'h2' },
  { name: 'Heading 3', value: 'h3' },
  { name: 'Heading 4', value: 'h4' },
  { name: 'Heading 5', value: 'h5' },
  { name: 'Heading 6', value: 'h6' },
  { name: 'Paragraph', value: 'p' },
] as const;

export const fontSizeOptions: Option[] = [
  { name: 'Size 1', value: 'looks-one' },
  { name: 'Size 2', value: 'looks-two' },
  { name: 'Size 3', value: 'looks-3' },
  { name: 'Size 4', value: 'looks-4' },
  { name: 'Size 5', value: 'looks-5' },
  { name: 'Size 6', value: 'looks-6' },
] as const;

export const fontNameOptions: Option[] = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' },
] as const;
