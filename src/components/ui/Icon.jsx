import { FaUsers } from "react-icons/fa6";
import { FaFile } from "react-icons/fa6";
import { FaRegTimesCircle } from "react-icons/fa";
import { FaTag } from "react-icons/fa6";



export const Users = ({color = "#000000", size="20"  }) => {
    return <FaUsers style={{ color, width: `${size}px` }} />
}

export const File = ({color = "#000000", size="20"  }) => {
    return <FaFile style={{ color, width: `${size}px` }} />
}

export const CrossCircle = ({color = "#000000", size="20", onClick = null  }) => {
    return <FaRegTimesCircle style={{ color, width: `${size}px` }} onClick={onClick} />
}

export const Tag = ({color = "#000000", size="20" }) => {
    return <FaTag style={{ color, width: `${size}px` }} />
}