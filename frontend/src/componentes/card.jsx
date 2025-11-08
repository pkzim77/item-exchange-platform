import * as React from "react";
import '../css/card.css'

function Card({ children, ...props }) {
    return (
        <div className="card" {...props}>
            {children}
        </div>
    )
}

function CardHeader({ children, className, ...props }) {
    return (
        <div className={`card-header ${className || ''}`} {...props}>
            {children}
        </div>
    )
}

function CardContent({ children, ...props }) {
    return (
        <div className="card-content" {...props}>
            {children}
        </div>
    )
}

function CardFooter({ children, ...props }) {
    return (
        <div className="card-footer" {...props}>
            {children}
        </div>
    )
}

export {
    Card,
    CardHeader,
    CardFooter,
    CardContent,
};