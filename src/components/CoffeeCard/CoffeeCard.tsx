import { hasRating, type CoffeeItem } from "../../types/coffee";
import starFilled from "../../assets/star-fill.svg";
import starEmpty from "../../assets/star.svg";
import "./CoffeeCard.css";

interface CoffeeCardProps {
  coffee: CoffeeItem;
}

/**
 * Format a rating for display: integers gain one decimal (5 -> "5.0"),
 * fractional values are shown as-is (4.85 -> "4.85"), matching the design.
 */
const formatRating = (rating: number): string =>
  Number.isInteger(rating) ? rating.toFixed(1) : String(rating);

/** Presentational coffee card. Receives data, owns no state. */
export const CoffeeCard = ({ coffee }: CoffeeCardProps) => {
  const { name, image, price, rating, votes, popular, available } = coffee;
  const rated = hasRating(coffee);

  return (
    <article className="coffee-card">
      <div className="coffee-card__media">
        <img
          className="coffee-card__image"
          src={image}
          alt={name}
          loading="lazy"
        />
        {popular && <span className="coffee-card__badge">Popular</span>}
      </div>

      <div className="coffee-card__header">
        <h3 className="coffee-card__name">{name}</h3>
        <span className="coffee-card__price">{price}</span>
      </div>

      <div className="coffee-card__footer">
        {rated ? (
          <p className="coffee-card__rating">
            <img
              className="coffee-card__star"
              src={starFilled}
              alt=""
              aria-hidden="true"
            />
            <span className="coffee-card__score">{formatRating(rating!)}</span>
            <span className="coffee-card__votes">({votes} votes)</span>
          </p>
        ) : (
          <p className="coffee-card__rating coffee-card__rating--empty">
            <img
              className="coffee-card__star"
              src={starEmpty}
              alt=""
              aria-hidden="true"
            />
            <span className="coffee-card__votes">No ratings</span>
          </p>
        )}

        {!available && (
          <span className="coffee-card__status">Sold out</span>
        )}
      </div>
    </article>
  );
};
