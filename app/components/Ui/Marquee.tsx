import React, { useEffect } from 'react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(Observer);

export default function Marquee() {
    useEffect(() => {
        const scrollingText = gsap.utils.toArray<HTMLElement>('.rail h4');

        const tl = horizontalLoop(scrollingText, {
            repeat: -1,
            paddingRight: 30,
        });

        Observer.create({
            onChangeY(self) {
                const factor = self.deltaY < 0 ? -2.5 : 2.5;
                gsap.timeline({ defaults: { ease: "none" } })
                    .to(tl, { timeScale: factor * 2.5, duration: 0.2, overwrite: true })
                    .to(tl, { timeScale: factor / 2.5, duration: 1 }, "+=0.3");
            }
        });

        function horizontalLoop(items: HTMLElement[], config: any) {
            const tl = gsap.timeline({
                repeat: config.repeat,
                paused: config.paused,
                defaults: { ease: "none" },
                onReverseComplete: () => {
                    tl.totalTime(tl.rawTime() + tl.duration() * 100);
                }
            });

            const length = items.length;
            const startX = items[0].offsetLeft;
            const times: number[] = [];
            const widths: number[] = [];
            const xPercents: number[] = [];
            let curIndex = 0;
            const pixelsPerSecond = (config.speed || 1) * 100;
            const snap = config.snap === false ? (v: number) => v : gsap.utils.snap(config.snap || 1);

            gsap.set(items, {
                xPercent: (i, el) => {
                    const w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string);
                    xPercents[i] = snap(
                        parseFloat(gsap.getProperty(el, "x", "px") as string) / w * 100 +
                        parseFloat(gsap.getProperty(el, "xPercent") as string)
                    );
                    return xPercents[i];
                }
            });

            gsap.set(items, { x: 0 });
            const totalWidth = items[length - 1].offsetLeft +
                xPercents[length - 1] / 100 * widths[length - 1] -
                startX +
                items[length - 1].offsetWidth * parseFloat(gsap.getProperty(items[length - 1], "scaleX") as string) +
                (parseFloat(config.paddingRight) || 0);

            for (let i = 0; i < length; i++) {
                const item = items[i];
                const curX = xPercents[i] / 100 * widths[i];
                const distanceToStart = item.offsetLeft + curX - startX;
                const distanceToLoop = distanceToStart + widths[i] * parseFloat(gsap.getProperty(item, "scaleX") as string);

                tl.to(item, { xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
                    .fromTo(item, { xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
                    .add("label" + i, distanceToStart / pixelsPerSecond);

                times[i] = distanceToStart / pixelsPerSecond;
            }

            function toIndex(index: number, vars: any) {
                vars = vars || {};
                if (Math.abs(index - curIndex) > length / 2) {
                    index += index > curIndex ? -length : length;
                }
                const newIndex = gsap.utils.wrap(0, length, index);
                let time = times[newIndex];
                if (time > tl.time() !== index > curIndex) {
                    vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
                    time += tl.duration() * (index > curIndex ? 1 : -1);
                }
                curIndex = newIndex;
                vars.overwrite = true;
                return tl.tweenTo(time, vars);
            }

            tl.next = (vars: any) => toIndex(curIndex + 1, vars);
            tl.previous = (vars: any) => toIndex(curIndex - 1, vars);
            tl.current = () => curIndex;
            tl.toIndex = (index: number, vars: any) => toIndex(index, vars);
            tl.times = times;
            tl.progress(1, true).progress(0, true);

            if (config.reversed && tl.vars.onReverseComplete) {
                tl.vars.onReverseComplete();
                tl.reverse();
            }
            return tl;
        }
    }, []);

    return (
        <div className="scrolling-text">
            <div className="rail">
                <h4 className='text-black'>Energy Saving VESA</h4>
                <h4 className='text-gray-400'>Energy Saving VESA</h4>
                <h4 className='text-black'>Energy Saving VESA</h4>
                <h4 className='text-gray-400'>Energy Saving VESA</h4>
                <h4 className='text-black'>Energy Saving VESA</h4>
            </div>
        </div>
    )
}
