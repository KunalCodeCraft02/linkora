import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

const Model3D = () => {
  const mountRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  const getSize = useCallback(() => {
    if (typeof window === 'undefined') return { w: 280, h: 280 };
    const w = window.innerWidth;
    if (w < 380) return { w: 220, h: 220 };
    if (w < 640) return { w: Math.min(w - 48, 300), h: Math.min(w - 48, 300) };
    return { w: 400, h: 400 };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    let animId;

    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    const { w, h } = getSize();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });

    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.8, 0);
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xf5f5f5, transparent: true, opacity: 0.6 });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    scene.add(wireframe);

    const dotsGeometry = new THREE.BufferGeometry();
    const vertices = [];
    const posAttr = geometry.getAttribute('position');
    for (let i = 0; i < posAttr.count; i++) {
      vertices.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
    }
    dotsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const dotsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.8 });
    const dots = new THREE.Points(dotsGeometry, dotsMaterial);
    scene.add(dots);

    camera.position.z = 5;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
      }
    };

    const handleResize = () => {
      const { w: newW, h: newH } = getSize();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      wireframe.rotation.x += 0.003;
      wireframe.rotation.y += 0.005;
      dots.rotation.x = wireframe.rotation.x;
      dots.rotation.y = wireframe.rotation.y;
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();
    setLoaded(true);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      edges.dispose();
    };
  }, [getSize]);

  if (!hasWebGL) {
    return (
      <div className="relative flex items-center justify-center w-[220px] h-[220px] sm:w-[400px] sm:h-[400px]">
        <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border border-white/10" style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)'
        }} />
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center w-full">
      <div ref={mountRef} className="w-[220px] h-[220px] sm:w-[400px] sm:h-[400px] flex items-center justify-center" style={{ lineHeight: 0 }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)'
        }}
      />
    </div>
  );
};

export default Model3D;