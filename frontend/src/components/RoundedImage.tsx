type RoundedImageProps = {
  src: string;
  size?: number;
  alt?: string;
};

export default function RoundedImage({
  src,
  size = 24,
  alt,
}: RoundedImageProps) {
  return (
    <div className="block relative">
      <img
        alt={alt}
        src={src}
        className={`mx-auto object-cover rounded-full h-${size} w-${size}`}
      />
    </div>
  );
}