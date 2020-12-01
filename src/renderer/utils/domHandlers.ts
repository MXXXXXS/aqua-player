export const innerText = (
  root: HTMLElement,
  selector: string,
  text: string
): void => {
  const el = root.querySelector<HTMLElement>(selector)
  if (el) {
    el.innerText = text
  }
}

export const onclick = (
  root: HTMLElement,
  selector: string,
  handler: (e: Event) => void
): void => {
  root.querySelector(selector)?.addEventListener('click', handler)
}
