import { useRef, useEffect } from 'react';

export default function ParticleBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let width, height;
        let particles = [];

        // Configuration
        const particleCount = 2500; // Dense sphere
        const baseRadius = 250; // Radius of the sphere
        const perspective = 800;

        // Mouse state
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;
        let rotationX = 0;
        let rotationY = 0;

        const colorPalette = [
            '#4285F4', // Google Blue
            '#EA4335', // Google Red
            '#FBBC05', // Google Yellow
            '#34A853', // Google Green
            '#ffffff'  // White
        ];

        class Particle {
            constructor(index, count) {
                // Fibonacci Sphere distribution
                const phi = Math.acos(1 - 2 * (index + 0.5) / count);
                const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);

                this.x = Math.cos(theta) * Math.sin(phi);
                this.y = Math.sin(theta) * Math.sin(phi);
                this.z = Math.cos(phi);

                this.baseX = this.x * baseRadius;
                this.baseY = this.y * baseRadius;
                this.baseZ = this.z * baseRadius;

                this.color = colorPalette[index % colorPalette.length];
                this.size = Math.random() * 1.5 + 0.5;
            }

            draw(ctx, time) {
                // Wave effect: modulate radius based on position and time
                // We use the original unit sphere coordinates (this.x, this.y, this.z) for the wave phase
                // to effectively create a 3D ripple.
                const waveAmplitude = 30;
                const waveFrequency = 4;
                const waveSpeed = 0.002;

                // Create a wave that moves across the sphere
                // Combining multiple sine waves for more organic feel
                const distortion = Math.sin(this.x * waveFrequency + time * waveSpeed) *
                    Math.cos(this.y * waveFrequency + time * waveSpeed) * waveAmplitude;

                const currentRadius = baseRadius + distortion;

                // 3D Rotation
                // Rotate around Y axis (horizontal mouse movement)
                const cosY = Math.cos(rotationY);
                const sinY = Math.sin(rotationY);

                let x1 = this.x * currentRadius * cosY - this.z * currentRadius * sinY;
                let z1 = this.z * currentRadius * cosY + this.x * currentRadius * sinY;

                // Rotate around X axis (vertical mouse movement)
                const cosX = Math.cos(rotationX);
                const sinX = Math.sin(rotationX);

                let y2 = this.y * currentRadius * cosX - z1 * sinX;
                let z2 = z1 * cosX + this.y * currentRadius * sinX;

                // Perspective projection
                const scale = perspective / (perspective + z2);
                const screenX = x1 * scale + width / 2;
                const screenY = y2 * scale + height / 2;

                // Only draw if within reasonable bounds (not too close to camera)
                if (z2 > -perspective + 10) {
                    const opacity = Math.max(0.1, Math.min(1, (z2 + baseRadius) / (2 * baseRadius)));

                    ctx.fillStyle = this.color;
                    ctx.globalAlpha = opacity;
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, this.size * scale, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
            }
        }

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            // Map mouse to rotation angles (-PI to PI usually too much, limit it)
            mouseX = (clientX - width / 2) * 0.001;
            mouseY = (clientY - height / 2) * 0.001;

            targetRotationY = mouseX * 2;
            targetRotationX = -mouseY * 2;
        };

        const init = () => {
            handleResize();
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(i, particleCount));
            }
        };

        const animate = (time) => {
            ctx.clearRect(0, 0, width, height);

            // Smooth rotation
            rotationX += (targetRotationX - rotationX) * 0.05;
            rotationY += (targetRotationY - rotationY) * 0.05;

            particles.forEach(p => p.draw(ctx, time));

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        init();
        animate(0);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none"
        />
    );
}
