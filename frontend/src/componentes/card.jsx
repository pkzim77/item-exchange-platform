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

function CardTitle({ children, className, ...props }) {
    return (
        <h3 className={`card-title ${className || ''}`} {...props}>
            {children}
        </h3>
    )
}

function CardDescription({ children, className, ...props }) {
    return (
        <p className={`card-description ${className || ''}`} {...props}>
            {children}
        </p>
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
    CardTitle,
    CardDescription,
    CardFooter,
    CardContent,
};