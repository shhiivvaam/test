import React from "react"

interface Avatar {
    imageUrl: string
    profileUrl: string
}

interface AvatarCirclesProps {
    className?: string
    numPeople?: number
    avatarUrls: Avatar[]
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const AvatarCircles = ({ className, avatarUrls, onClick }: AvatarCirclesProps) => {
    return (
        <div className={`z-10 flex -space-x-4 rtl:space-x-reverse ${className}`}>
            {avatarUrls.map((url, index) => (
                <a key={index} href={url.profileUrl} target="_blank" rel="noopener noreferrer">
                    <img
                        key={index}
                        className="h-7 w-7 rounded-full border-2 border-white dark:border-gray-800"
                        src={url.imageUrl}
                        width={40}
                        height={40}
                        alt={`Avatar ${index + 1}`}
                    />
                </a>
            ))}
            <div
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black"
                onClick={onClick}
            >
                +
            </div>
            {/* for showing total number of users invited */}
            {/* {(numPeople ?? 0) > 0 && (
                <a
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black"
                    href=""
                >
                    +
                </a>
            )} */}
        </div>
    )
}