import React from 'react'
import './card.css';

interface CardProps {
  src?: string
  id: string,
  tag?: string,
  onMenuClick: (_id: string) => void;
}

export const Card = ({ src, id, tag, onMenuClick }: CardProps) => {
  return (
    <span className="card" onClick={() => onMenuClick(id)}>
      {src ? (
        <>
          <img className="card__blur" src={src} alt="" />
          <img className="card__img" src={src} alt="" />
        </>
      ) : (
        <span className="text-ellipsis overflow-hidden text-white px-1 whitespace-nowrap text-xs">{tag}</span>
      )}
    </span>
  )

}