import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import teddy1 from '../../assets/teddy1.png';
import teddy2 from '../../assets/teddy2.png';
import teddy3 from '../../assets/teddy3.png';
import teddy4 from '../../assets/teddy4.png';

const images = { teddy1, teddy2, teddy3, teddy4 };

function clamp(n, lo, hi) {
	return Math.max(lo, Math.min(hi, n));
}

/** Base display width (px) before sizeMultiplier — scales with shortest viewport side */
function computeBaseDecorWidth(viewportW, viewportH) {
	const m = Math.min(viewportW, viewportH);
	const maj = Math.max(viewportW, viewportH);
	if (m < 330) return Math.round(clamp(m * 0.27, 88, 124));
	if (m < 380) return Math.round(clamp(m * 0.26, 92, 132));
	if (m < 480) return Math.round(clamp(m * 0.245, 96, 142));
	if (m < 640) return Math.round(clamp(m * 0.22, 100, 158));
	if (m < 820) return Math.round(clamp(m * 0.19, 118, 178));
	if (maj >= 1600 && m >= 900) return Math.round(clamp(m * 0.14, 168, 240));
	return Math.round(clamp(m * 0.16, 150, 220));
}

const TeddyBear = ({
	type = 'teddy3',
	delay = 0.5,
	sizeMultiplier = 1,
	/** Extra fraction of viewport height kept clear at bottom (cake / CTA); default ~11% */
	stackReserve = 0.11,
}) => {
	const [dims, setDims] = useState(() => ({
		w: typeof window !== 'undefined' ? window.innerWidth : 390,
		h: typeof window !== 'undefined' ? window.innerHeight : 844,
	}));
	const [imgAspect, setImgAspect] = useState(1.08);

	useEffect(() => {
		const read = () =>
			setDims({
				w: window.innerWidth,
				h: window.innerHeight,
			});
		read();
		window.addEventListener('resize', read);
		return () => window.removeEventListener('resize', read);
	}, []);

	const onImgLoad = useCallback((e) => {
		const { naturalWidth, naturalHeight } = e.target;
		if (naturalWidth > 0 && naturalHeight > 0) {
			setImgAspect(naturalHeight / naturalWidth);
		}
	}, []);

	const baseW = useMemo(
		() => computeBaseDecorWidth(dims.w, dims.h),
		[dims.w, dims.h]
	);
	const imgW = Math.max(48, Math.round(baseW * sizeMultiplier));
	const imgH = imgW * imgAspect;

	const edgeX = Math.max(10, Math.round(dims.w * 0.022));
	const edgeTop = Math.max(62, Math.round(dims.h * 0.054));
	const bottomGap = Math.max(
		52,
		Math.round(dims.h * stackReserve),
		Math.round(dims.h * 0.045)
	);

	const animateTL = useMemo(
		() => ({
			left: edgeX,
			top: edgeTop,
			opacity: 1,
			rotate: 0,
		}),
		[edgeX, edgeTop]
	);

	const animateBR = useMemo(() => {
		const extraInset =
			dims.w < 400 ? 10 : dims.w < 480 ? 8 : dims.w < 768 ? 6 : 4;
		const leftPx = Math.max(0, dims.w - imgW - edgeX - extraInset);
		const topPx = Math.max(0, dims.h - imgH - bottomGap);
		return {
			left: leftPx,
			top: topPx,
			opacity: 1,
			rotate: 0,
		};
	}, [dims.w, dims.h, imgW, imgH, edgeX, bottomGap]);

	const initialTL = useMemo(
		() => ({
			left: -imgW * 1.35,
			top: Math.round(dims.h * 0.92),
			opacity: 0,
			rotate: -18,
		}),
		[dims.h, imgW]
	);

	const initialBR = useMemo(
		() => ({
			left: dims.w + imgW * 0.15,
			top: -Math.round(imgH * 0.55),
			opacity: 0,
			rotate: 18,
		}),
		[dims.w, imgH]
	);

	const initial = type === 'teddy4' ? initialBR : initialTL;
	const animate = type === 'teddy4' ? animateBR : animateTL;

	return (
		<motion.div
			initial={initial}
			animate={animate}
			transition={{
				duration: 3.5,
				delay,
				ease: [0.34, 1.56, 0.64, 1],
			}}
			className={`fixed pointer-events-none z-[35] teddy-bear-deco teddy-bear-deco--${type}`}
			style={{ width: imgW }}
		>
			<motion.div
				animate={{
					y: [0, -12, 0],
					rotate: [0, 2, -2, 0],
				}}
				transition={{
					duration: 4,
					repeat: Infinity,
					ease: 'easeInOut',
					delay: delay + 3.5,
				}}
				className="w-full h-auto"
			>
				<img
					src={images[type]}
					alt={`Teddy ${type}`}
					className="w-full h-auto block drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
					onLoad={onImgLoad}
					draggable={false}
				/>
			</motion.div>
		</motion.div>
	);
};

export default TeddyBear;
