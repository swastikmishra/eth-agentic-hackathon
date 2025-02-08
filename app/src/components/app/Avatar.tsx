import React from "react";

interface AvatarProps {
    username: string;
}

const getInitials = (username: string): string => {
    const parts = username.split(/[\s\-]+/).filter(Boolean);
    if (parts.length === 0) return "";
    // Use up to the first two parts to generate initials
    const initials = parts
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("");
    return initials;
};

const Avatar: React.FC<AvatarProps> = ({ username }) => {
    // const backgroundColor = "#76b852";
    const initials = React.useMemo(() => getInitials(username), [username]);

    return (
        <div
            className="shadow-md bg-primary text-sm"
            style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "white",
            }}
        >
            {initials}
        </div>
    );
};

export default Avatar;
