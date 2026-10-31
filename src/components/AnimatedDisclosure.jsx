import React, { useEffect, useRef, useState } from 'react';

export default function AnimatedDisclosure({ title, children, className }) {
  const details = useRef(null),
    summary = useRef(null),
    animation = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const intendedOpen = useRef(false);
  useEffect(() => () => animation.current?.cancel(), []);

  function toggle(event) {
    event.preventDefault();
    const element = details.current;
    const start = element.getBoundingClientRect().height;
    const opening = !intendedOpen.current;
    intendedOpen.current = opening;
    setExpanded(opening);
    animation.current?.cancel();
    element.style.height = '';
    element.open = true;
    const style = getComputedStyle(element);
    const border =
      parseFloat(style.borderTopWidth) +
      parseFloat(style.borderBottomWidth) +
      parseFloat(style.paddingTop) +
      parseFloat(style.paddingBottom);
    const end = opening
      ? element.getBoundingClientRect().height
      : summary.current.getBoundingClientRect().height + border;
    const settle = () => {
      element.open = opening;
      element.style.height = '';
      element.style.overflow = '';
      animation.current = null;
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !element.animate) {
      settle();
      return;
    }
    element.style.height = `${start}px`;
    element.style.overflow = 'hidden';
    animation.current = element.animate([{ height: `${start}px` }, { height: `${end}px` }], {
      duration: 200,
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    });
    animation.current.onfinish = settle;
  }

  return (
    <details ref={details} className={className} data-expanded={expanded}>
      <summary ref={summary} aria-expanded={expanded} onClick={toggle}>
        {title}
        <span aria-hidden="true">+</span>
      </summary>
      {children}
    </details>
  );
}
