import { titleToHue } from '../../utils/format.js';

// اگر محصول عکس نداشته باشد، یک بلوک رنگی با حرف اول عنوان نشان می‌دهیم.
const ProductImage = ({ src, title }) => {
  const style = { '--hue': titleToHue(title) };

  if (src) {
    return <img className="product-image" src={src} alt={title} loading="lazy" style={style} />;
  }

  return (
    <div className="product-image" style={style} aria-hidden="true">
      {title.trim().charAt(0)}
    </div>
  );
};

export default ProductImage;
