import { useRef, useState, useEffect } from 'react';
import slide3301 from '../scripts/_extracted/pptx-images/slide-33-01.jpg';
import slide3302 from '../scripts/_extracted/pptx-images/slide-33-02.png';
import slide3303 from '../scripts/_extracted/pptx-images/slide-33-03.png';
import LoadingScreen from './components/LoadingScreen';
import { useImagePreload } from './hooks/useImagePreload';
import './App.css';

// Critical images to preload for fast initial rendering
const criticalImages = [
  '/molbio-black-logo.png',
  '/Global regitrations/01.png',
  '/Global regitrations/02.png',
  '/Global regitrations/03.png',
  '/Global regitrations/04.png',
  '/Global regitrations/05.png',
  '/Global regitrations/06.png',
  '/WHO/who.png',
  '/implementation1.png',
  '/implementation2.png',
  '/certtificates/MDSAP.png',
  '/certtificates/EVIVDR.png',
  '/certtificates/ISO.png',
  '/submitted image.jpg',
];

function App() {
  // Preload critical images for fast rendering
  const { imagesLoaded, loadProgress } = useImagePreload(criticalImages);

  const contentsRef = useRef(null);
  const productLicensingRef = useRef(null);
  const globalRegistrationsRef = useRef(null);
  const whoTechnicalRef = useRef(null);
  const qualityObjectivesRef = useRef(null);
  const implementationRef = useRef(null);
  const [showSections, setShowSections] = useState(false);
  const [showGlobalRegSections, setShowGlobalRegSections] = useState(false);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [currentGlobalImage, setCurrentGlobalImage] = useState(1);
  const [showAsiaTable, setShowAsiaTable] = useState(false);
  const [showAfricaTable, setShowAfricaTable] = useState(false);
  const [showNorthAmericaTable, setShowNorthAmericaTable] = useState(false);
  const [showSouthAmericaTable, setShowSouthAmericaTable] = useState(false);
  const [showEuropeTable, setShowEuropeTable] = useState(false);
  const [showWhoTimeline, setShowWhoTimeline] = useState(false);
  const [showGlobalRegAnimation, setShowGlobalRegAnimation] = useState(false);
  const [showWhoImageOnly, setShowWhoImageOnly] = useState(false);
  const [showWhoContent, setShowWhoContent] = useState(false);
  const [activeWhoTimeline, setActiveWhoTimeline] = useState('mtbplus'); // 'mtbplus' or 'rifex'
  const [whoNavLock, setWhoNavLock] = useState(false);
  const [showQualityFlash, setShowQualityFlash] = useState(false);
  const [activeQualityObj, setActiveQualityObj] = useState(null);
  const [showQualityDetail, setShowQualityDetail] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [showImplIntro, setShowImplIntro] = useState(false);
  const [showImplMain, setShowImplMain] = useState(false);
  const [currentImplImage, setCurrentImplImage] = useState(1); // 1: implementation1, 2: implementation2, 3: certifications slide
  const [showCertIntro, setShowCertIntro] = useState(false);
  const [showCertMain, setShowCertMain] = useState(false);
  const heroRef = useRef(null);
  const fullscreenTargetRef = useRef(null);

  const resetGlobalRegAnimation = () => {
    setShowGlobalRegAnimation(false);
    setTimeout(() => {
      setShowGlobalRegAnimation(true);
    }, 600);
  };

  const resetGlobalRegState = () => {
    setCurrentGlobalImage(1);
    setShowAsiaTable(false);
    setShowAfricaTable(false);
    setShowNorthAmericaTable(false);
    setShowSouthAmericaTable(false);
    setShowEuropeTable(false);
    resetGlobalRegAnimation();
  };

  // Track hero section visibility to show/hide back button
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShowBackButton(!entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  // Trigger Implementation intro when section becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowImplIntro(true);
            setShowImplMain(false);
            setCurrentImplImage(1);
            setTimeout(() => setShowImplMain(true), 500);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (implementationRef.current) {
      observer.observe(implementationRef.current);
    }

    return () => {
      if (implementationRef.current) {
        observer.unobserve(implementationRef.current);
      }
    };
  }, []);

  // Trigger Certificates intro when switching to step 3
  useEffect(() => {
    if (currentImplImage === 3) {
      setShowCertIntro(true);
      setShowCertMain(false);
      setTimeout(() => {
        setShowCertIntro(false);
        setShowCertMain(true);
      }, 500);
    } else {
      setShowCertIntro(false);
      setShowCertMain(false);
    }
  }, [currentImplImage]);

  const goBack = () => {
        // If we're in a detail page view, exit it and stay in Product Licensing
        if (showDetailPage) {
          setShowDetailPage(false);
          setActiveSection(null);
          setTimeout(() => {
            productLicensingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
          return;
        }

    // Determine current section and scroll to previous
    const sections = [
      heroRef,
      contentsRef,
      productLicensingRef,
      globalRegistrationsRef,
      whoTechnicalRef,
      qualityObjectivesRef,
      implementationRef
    ];

    // Find which section is currently visible
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i].current;
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          // If in implementation section, step back through images/slides first
          if (i === 6) {
            if (currentImplImage === 4) {
              setCurrentImplImage(3);
              return;
            }
            if (currentImplImage === 3) {
              setCurrentImplImage(2);
              return;
            }
            if (currentImplImage === 2) {
              setCurrentImplImage(1);
              return;
            }
          }
          // If in global registrations section, step back through images
          if (i === 3) {
            if (currentGlobalImage > 1) {
              setCurrentGlobalImage(prev => prev - 1);
              setShowAsiaTable(false);
              setShowAfricaTable(false);
              setShowNorthAmericaTable(false);
              setShowSouthAmericaTable(false);
              setShowEuropeTable(false);
              return;
            }
          }
          // If in WHO section, step within timelines before leaving the section
          if (i === 4) {
            if (activeWhoTimeline === 'rifex') {
              // Go back to MTB Plus timeline
              setActiveWhoTimeline('mtbplus');
              // Ensure content is visible when stepping back
              setShowWhoImageOnly(false);
              setShowWhoContent(true);
              return;
            }
          }
          // Scroll to previous section if available
          if (i - 1 >= 0) {
            // Reset detail page view when moving away from Global Registrations back to Product Licensing
            if (i === 3) {
              setShowDetailPage(false);
              setActiveSection(null);
            }
            sections[i - 1].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          break;
        }
      }
    }
  };

  const goForward = () => {
        // If we're in a detail page view, exit it and go to Global Registrations
        if (showDetailPage) {
          setShowDetailPage(false);
          setActiveSection(null);
          resetGlobalRegState();
          setTimeout(() => {
            globalRegistrationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
          return;
        }

    // Determine current section and scroll to next
    const sections = [
      heroRef,
      contentsRef,
      productLicensingRef,
      globalRegistrationsRef,
      whoTechnicalRef,
      qualityObjectivesRef,
      implementationRef
    ];

    // Find which section is currently visible
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].current;
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          // If in implementation section, cycle through implementation steps/images
          if (i === 6) {
            if (currentImplImage === 1) {
              setCurrentImplImage(2);
              return;
            }
            if (currentImplImage === 2) {
              setCurrentImplImage(3);
              return;
            }
            if (currentImplImage === 3) {
              setCurrentImplImage(4);
              return;
            }
            // Already at last page (Thank You), don't go forward
            if (currentImplImage === 4) {
              return;
            }
          }
          // If in global registrations section, cycle through images
          if (i === 3) {
            if (currentGlobalImage < 6) {
              setCurrentGlobalImage(prev => prev + 1);
              setShowAsiaTable(false);
              setShowAfricaTable(false);
              setShowNorthAmericaTable(false);
              setShowSouthAmericaTable(false);
              setShowEuropeTable(false);
              return;
            }
            // At last global image, prepare WHO timeline visibility
            setActiveWhoTimeline('mtbplus');
            setShowWhoTimeline(true);
          }
          // If in WHO section, advance within WHO before leaving
          if (i === 4) {
            if (whoNavLock) return;
            setWhoNavLock(true);
            setTimeout(() => setWhoNavLock(false), 400);
            // Step 1: if on MTB Plus, switch to RIF Dx and show content
            if (activeWhoTimeline === 'mtbplus') {
              setActiveWhoTimeline('rifex');
              setShowWhoTimeline(true);
              setShowWhoImageOnly(false);
              setShowWhoContent(true);
              return;
            }
            // Step 2: RIF Dx content is visible -> move to Quality Objectives
            setShowWhoTimeline(false);
            setShowWhoImageOnly(false);
            setShowWhoContent(false);
            setActiveQualityObj(null);
            setShowQualityDetail(false);
            setShowQualityFlash(true);
            setTimeout(() => setShowQualityFlash(false), 600);
            setTimeout(() => {
              qualityObjectivesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
            return;
          }
          // Scroll to next section if not at last section
          if (i < sections.length - 1) {
            // Reset detail page view when leaving Product Licensing section
            if (i === 2) {
              setShowDetailPage(false);
              setActiveSection(null);
              resetGlobalRegState();
            }
            // Prime Implementation section when moving from Quality Objectives so it never renders blank
            if (i === 5) {
              setShowImplIntro(true);
              setShowImplMain(false);
              setCurrentImplImage(1);
              setShowCertIntro(false);
              setShowCertMain(false);
              setTimeout(() => setShowImplMain(true), 500);
            }
            sections[i + 1].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          break;
        }
      }
    }
  };

  const contentItems = [
    { id: '01', title: 'Product License CLA/SLA', desc: 'Submitted, Approved, Queries, Products in pipeline', color: 'blue' },
    { id: '02', title: 'Global Registrations', desc: 'Countrywise product registration status (registered / ongoing)', color: 'red' },
    { id: '03', title: 'Technical Dossier', desc: 'Section-Wise schedule for WHO Technical Dossier (TD)', color: 'cyan' },
    { id: '04', title: 'Implementation', desc: 'IVDR 2017/746 implementation and Launch of regulatory update forum', color: 'yellow' },
    { id: '05', title: 'Quality Objectives', desc: 'Current status of quality objectives 2025', color: 'teal' },
    { id: '06', title: 'QMS Certifications', desc: 'ISO 13485, MDSAP, IVDR 2017/746 certificates', color: 'pink' }
  ];

  const licensingSections = [
    { id: 1, title: 'Approvals & Submissions' },
    { id: 2, title: 'Inprocess Applications' },
    { id: 3, title: 'Products in Pipeline' },
    { id: 4, title: 'Manufacturing License Status' }
  ];

  // Contents section - reset animation every time section comes into view
  useEffect(() => {
    const contentsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowSections(false);
            setTimeout(() => {
              setShowSections(true);
            }, 500);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (contentsRef.current) {
      contentsObserver.observe(contentsRef.current);
    }

    return () => {
      if (contentsRef.current) {
        contentsObserver.unobserve(contentsRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reset and trigger animation every time section comes into view
            setShowSections(false);
            setTimeout(() => {
              setShowSections(true);
            }, 500);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (productLicensingRef.current) {
      observer.observe(productLicensingRef.current);
    }

    return () => {
      if (productLicensingRef.current) {
        observer.unobserve(productLicensingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowGlobalRegSections(false);
            setTimeout(() => {
              setShowGlobalRegSections(true);
            }, 500);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (globalRegistrationsRef.current) {
      observer2.observe(globalRegistrationsRef.current);
    }

    return () => {
      if (globalRegistrationsRef.current) {
        observer2.unobserve(globalRegistrationsRef.current);
      }
    };
  }, []);

  // WHO Technical Dossier - Show content directly without image
  useEffect(() => {
    if (showWhoTimeline) {
      setShowWhoImageOnly(false);
      setShowWhoContent(true);
      return () => {};
    } else {
      setShowWhoImageOnly(false);
      setShowWhoContent(false);
    }
  }, [showWhoTimeline]);

  // Quality Objectives: flash red for a moment when section becomes visible
  useEffect(() => {
    const qoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowQualityFlash(true);
            setTimeout(() => setShowQualityFlash(false), 500);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (qualityObjectivesRef.current) {
      qoObserver.observe(qualityObjectivesRef.current);
    }

    return () => {
      if (qualityObjectivesRef.current) {
        qoObserver.unobserve(qualityObjectivesRef.current);
      }
    };
  }, []);

  // Always start at top when opening any detail page/section
  useEffect(() => {
    if (showDetailPage) {
      // Jump to very top of the window for new pages
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [showDetailPage, activeSection]);

  // Keyboard navigation with arrow keys
  useEffect(() => {
    const captureCurrentSection = () => {
      const sections = [
        heroRef,
        contentsRef,
        productLicensingRef,
        globalRegistrationsRef,
        whoTechnicalRef,
        qualityObjectivesRef,
        implementationRef
      ];
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i].current;
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        const anchor = window.innerHeight * 0.4;
        if (rect.top <= anchor && rect.bottom >= anchor) {
          return section;
        }
      }
      return null;
    };

    const handleKeyDown = (event) => {
      // Toggle fullscreen with 'F'
      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        // remember which section is visible before toggling
        fullscreenTargetRef.current = captureCurrentSection();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        return;
      }

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        goForward();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        goBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goForward, goBack]);

  // Keep the current section aligned when entering or exiting fullscreen
  useEffect(() => {
    const alignCurrentSection = () => {
      if (fullscreenTargetRef.current) {
        fullscreenTargetRef.current.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
        fullscreenTargetRef.current = null;
        return;
      }
      const sections = [
        heroRef,
        contentsRef,
        productLicensingRef,
        globalRegistrationsRef,
        whoTechnicalRef,
        qualityObjectivesRef,
        implementationRef
      ];

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i].current;
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
          section.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
          break;
        }
      }
    };

    const handleFullscreenChange = () => {
      // Wait for layout to settle before aligning
      requestAnimationFrame(() => alignCurrentSection());
      setTimeout(() => alignCurrentSection(), 120);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const scrollToContents = () => {
    // Enter fullscreen
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => {
          // Wait for fullscreen transition to complete, then scroll
          setTimeout(() => {
            contentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
          }, 300);
        })
        .catch(err => {
          console.log('Fullscreen request failed:', err);
          // If fullscreen fails, still navigate
          contentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        });
    } else {
      // Already in fullscreen, just navigate
      contentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  };

  const scrollToProductLicensing = () => {
    productLicensingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  };

  const scrollToGlobalRegistrations = () => {
    globalRegistrationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  };

  const scrollToWhoTechnical = () => {
    setActiveWhoTimeline('mtbplus');
    setShowWhoTimeline(true);
    whoTechnicalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  };

  const scrollToQualityObjectives = () => {
    setShowQualityFlash(true);
    qualityObjectivesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    setTimeout(() => {
      qualityObjectivesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      setShowQualityFlash(false);
    }, 500);
  };

  const openQualityDetail = (obj) => {
    // Toggle: if clicking the same objective, close it
    if (activeQualityObj && activeQualityObj.number === obj.number) {
      closeQualityDetail();
    } else {
      setActiveQualityObj(obj);
      setShowQualityDetail(true);
    }
  };

  const closeQualityDetail = () => {
    setShowQualityDetail(false);
    setActiveQualityObj(null);
    setTimeout(() => {
      qualityObjectivesRef.current?.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
    }, 0);
  };

  // Lightweight KPI donut chart
  const DonutChart = ({ value, size = 72, stroke = 8, track = '#e2e8f0', fill = '#16a34a' }) => {
    const radius = (size - stroke) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.max(0, Math.min(100, value || 0));
    const dash = (clamped / 100) * circumference;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={radius} stroke={track} strokeWidth={stroke} fill="none" />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={fill}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
    );
  };

  const getObjectiveMetrics = (obj) => {
    if (!obj) return { totalTasks: 0, completedTasks: 0, ongoingTasks: 0, pendingTasks: 0, overallProgress: 0, indicatorProgress: [] };
    const allTasks = obj.indicators.flatMap(ind => ind.tasks);
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => (t.status === 'Completed') || (t.completed >= 100)).length;
    const ongoingTasks = allTasks.filter(t => t.status === 'Ongoing').length;
    const pendingTasks = Math.max(0, totalTasks - completedTasks);

    const totalAllocated = allTasks.reduce((a, t) => a + (t.allocated || 0), 0);
    const weightedCompleted = allTasks.reduce((a, t) => a + ((t.completed || 0) * (t.allocated || 0)) / 100, 0);
    const overallProgress = totalAllocated ? Math.round((weightedCompleted / totalAllocated) * 100) : 0;

    const indicatorProgress = obj.indicators.map(ind => {
      const alloc = ind.tasks.reduce((a, t) => a + (t.allocated || 0), 0);
      const comp = ind.tasks.reduce((a, t) => a + ((t.completed || 0) * (t.allocated || 0)) / 100, 0);
      return alloc ? Math.round((comp / alloc) * 100) : 0;
    });

    return { totalTasks, completedTasks, ongoingTasks, pendingTasks, overallProgress, indicatorProgress };
  };

  const toggleGlobalImage = () => {
    setCurrentGlobalImage(prev => prev === 6 ? 1 : prev + 1);
    setShowAsiaTable(false);
    setShowAfricaTable(false);
    setShowNorthAmericaTable(false);
    setShowSouthAmericaTable(false);
    setShowEuropeTable(false);
  };

  useEffect(() => {
    if (currentGlobalImage === 2) {
      const timer = setTimeout(() => {
        setShowAsiaTable(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentGlobalImage === 3) {
      const timer = setTimeout(() => {
        setShowAfricaTable(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentGlobalImage === 4) {
      const timer = setTimeout(() => {
        setShowNorthAmericaTable(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentGlobalImage === 5) {
      const timer = setTimeout(() => {
        setShowSouthAmericaTable(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentGlobalImage === 6) {
      const timer = setTimeout(() => {
        setShowEuropeTable(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowAsiaTable(false);
      setShowAfricaTable(false);
      setShowNorthAmericaTable(false);
      setShowSouthAmericaTable(false);
      setShowEuropeTable(false);
    }
  }, [currentGlobalImage]);

  // WHO Technical section animation observer
  useEffect(() => {
    const whoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reset to MTB Plus timeline whenever WHO section becomes visible
            setActiveWhoTimeline('mtbplus');
            setShowWhoTimeline(false);
            setTimeout(() => {
              setShowWhoTimeline(true);
            }, 500);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (whoTechnicalRef.current) {
      whoObserver.observe(whoTechnicalRef.current);
    }

    return () => {
      if (whoTechnicalRef.current) {
        whoObserver.unobserve(whoTechnicalRef.current);
      }
    };
  }, []);

  // Global Registrations section animation observer
  useEffect(() => {
    const grObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowGlobalRegAnimation(false);
            setTimeout(() => {
              setShowGlobalRegAnimation(true);
            }, 500);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (globalRegistrationsRef.current) {
      grObserver.observe(globalRegistrationsRef.current);
    }

    return () => {
      if (globalRegistrationsRef.current) {
        grObserver.unobserve(globalRegistrationsRef.current);
      }
    };
  }, []);

  const handleSectionClick = (sectionId) => {
    console.log('Clicked section:', sectionId);
    if (sectionId === 1 || sectionId === 2 || sectionId === 3 || sectionId === 4) {
      setActiveSection(sectionId);
      setShowDetailPage(true);
      console.log('Set activeSection to:', sectionId);
    }
  };

  const handleBackToMain = () => {
    setActiveSection(null);
    setShowDetailPage(false);
    // After switching view, ensure Product Licensing section top is aligned
    setTimeout(() => {
      productLicensingRef.current?.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
    }, 0);
  };

  // Detail page data
  const licenseData = {
    approved: [
      { category: 'Test license', siteI: '04 products', siteV: '02 products' },
      { category: 'Manufacturing license', siteI: '21 products', siteV: '04 products' },
      { category: 'Condition fulfillment', siteI: '04 products', siteV: '' },
      { category: 'Total', siteI: '29 products', siteV: '06 products' }
    ],
    submitted: [
      { category: 'Test license', siteI: '04 products', siteV: '02 products' },
      { category: 'Manufacturing license', siteI: '53 products', siteV: '14 products' },
      { category: 'Condition fulfillment', siteI: 'NA', siteV: '' },
      { category: 'Total', siteI: '57 products', siteV: '16 products' }
    ]
  };

  // Inprocess Applications data
  const inprocessData = {
    counts: {
      testLicenseResponded: 8,
      testLicenseQuery: 3,
      mfgLicenseResponded: 55,
      mfgLicenseQuery: 1,
      conditionResponded: 9,
      conditionQuery: 6,
      clinicalResponded: 1,
      clinicalQuery: 0,
      newIVDResponded: 0,
      newIVDQuery: 7,
      retentionResponded: 27,
      retentionQuery: 0
    },
    table: [
      {
        no: '01',
        type: 'Test license',
        name: 'Truenat® Dengue/Zika (Reapplication)',
        site: 'I',
        status: 'Awaiting CDSCO approved testing lab'
      },
      {
        no: '02',
        type: 'Test license',
        name: 'Truenat® CHPV',
        site: 'I & V',
        status: 'No CDSCO approved predicate device'
      },
      {
        no: '03',
        type: 'Manufacturing license',
        name: 'Truenat® KFDV',
        site: 'I',
        status: 'Approval of Form MD-29'
      },
      {
        no: '04',
        type: 'New IVD',
        name: 'Truenat® KFDV',
        site: 'I',
        status: 'Clinical evaluation data on specimen collected from feild and statistically powered sample size'
      },
      {
        no: '05',
        type: 'New IVD',
        name: 'Truenat® Inf A,B/COVID-19, Truenat® Nipah, Truenat® COVID-19, Truenat® SARS CoV-2, Truenat® Beta CoV & Truemix™ COVID-19',
        site: 'I',
        status: 'Recent Clinical evaluation data (last 1 year)'
      },
      {
        no: '06',
        type: 'Condition Fulfillment',
        name: 'Truenat® MTB, Truenat® MTB Plus, Truenat® MTB RIF Dx, Truenat® HCV, Truenat® CT & Truenat® COVID-19',
        site: 'V',
        status: 'Stability study and PER for EPTB Sample as claimed in IFU'
      }
    ]
  };

  // Manufacturing License Status data
  const mlStatus = {
    internalValidation: [
      'Truetell™/Promilless™ 0.02%',
      'Truetell™/Promilless™ 0.05%'
    ],
    clinicalEvaluation: [
      'Truenat® MTB Ultima',
      'Truenat® HPV HR 16/18',
      'Truenat® Zika',
      'Truenat® Brucella',
      'Truenat® RSV',
      'Truenat® Malaria Pv/Pf Hi Sens',
      'Truenat® Salmonella-FQ',
      'Truemix™ HPV-HR Plus',
      'Truelyse™ Buffer'
    ],
    designFile: [
      'Truemix™ Zika / Dengue / Chikungunya',
      'Truemix™ Carb-R',
      'Truemix™ BCR-ABL',
      'Truemix™ MTB Ultima',
      'Truemix™ Sepsis Panel',
      'Truemix™ Respiratory Panel',
      'Truebact™ MTB DST',
      'Truenat® HMPV / COVID-19 / Influenza',
      'Truenat® HMPV and M. pneumonia',
      'Truenat® H5N1',
      'Trueamp™ Respiratory Panel',
      'Truenat® Syphilis'
    ],
    lotsNotTaken: [
      'Truenat® Staph/MRSA',
      'Truenat® Rota V (Reapplication)',
      'Truenat® Mucormycosis (Reapplication)',
      'Truenat® Rubella / Measles',
      'Truenat® Mumps',
      'Truenat® Positive Control Kit - Panel VI',
      'Truenat® Positive Control Kit - Panel VII',
      'Truenat® Positive Control Kit - Panel VIII',
      'Truenat® Toxo',
      'Truemix™ HCV (Reapplication)',
      'Truemix™ HBV (Reapplication)',
      'Truemix™ HIV-1/HIV-2 (Reapplication)',
      'Truemix™ HPV-HR Plus',
      'Truemix™ MPX',
      'Truenat® HMPV',
      'Truenat® JEV (Reapplication)',
      'Truenat® SCD (Reapplication)',
      'Truenat® RSV (Reapplication)'
    ],
    stability: [
      'Truenat® MPX (more 2 lots)',
      'Truetell™/Promilless™ 0.0%'
    ]
  };

  // Global Registrations continents and countries
  const globalContinents = [
    {
      id: 'north-america',
      name: 'NORTH & CENTRAL\nAMERICAN CONTINENT',
      position: 'nca',
      countries: ['El Salvador', 'Guatemala', 'Honduras', 'Nicaragua', 'Panama', 'Costa Rica', 'Mexico']
    },
    {
      id: 'south-america',
      name: 'SOUTH AMERICAN\nCONTINENT',
      position: 'sa',
      countries: ['Brazil', 'Peru', 'Colombia', 'Paraguay', 'Bolivia']
    },
    {
      id: 'europe',
      name: 'EUROPEAN\nCONTINENT',
      position: 'eu',
      countries: ['United Kingdom', 'Romania', 'Azerbaijan']
    },
    {
      id: 'africa',
      name: 'AFRICAN\nCONTINENT',
      position: 'af',
      countries: ['Morocco', 'South Africa', 'Nigeria', 'Kenya', 'Zambia', 'Ghana', 'Botswana', 'Gambia']
    },
    {
      id: 'asia',
      name: 'ASIAN\nCONTINENT',
      position: 'as',
      countries: ['Iran', 'Taiwan', 'Thailand', 'Vietnam', 'Philippines', 'UAE']
    }
  ];

  // Asia continent registration data
  const asiaRegistrationData = [
    {
      country: 'Iran',
      regulator: 'Iranian Food and Drug Administration',
      registered: 'NA',
      ongoing: '41'
    },
    {
      country: 'Taiwan',
      regulator: 'The Taiwan Food and Drug Administration (TFDA)',
      registered: 'NA',
      ongoing: '15'
    },
    {
      country: 'Thailand',
      regulator: 'Thai Food and drug Administration',
      registered: 'NA',
      ongoing: '21'
    },
    {
      country: 'Vietnam',
      regulator: 'Ministry of Health',
      registered: 'NA',
      ongoing: '06'
    },
    {
      country: 'Philippines',
      regulator: 'Center for Device Regulation, Radiation Health, and Research (CDRRHR)',
      registered: '01',
      ongoing: '01'
    },
    {
      country: 'UAE',
      regulator: 'Ministry of Health and Prevention (MOHAP)',
      registered: '05',
      ongoing: 'NA'
    }
  ];

  // Africa continent registration data
  const africaRegistrationData = [
    {
      country: 'Morocco',
      regulator: 'Directorate of Medicines and Pharmacy',
      registered: 'NA',
      ongoing: '39'
    },
    {
      country: 'South Africa',
      regulator: 'South African Health Products Regulatory Authority (SAHPRA)',
      registered: 'NA',
      ongoing: '08'
    },
    {
      country: 'Nigeria',
      regulator: 'National Agency for Food and Drug Administration and Control (NAFDAC)',
      registered: 'NA',
      ongoing: '02'
    },
    {
      country: 'Kenya',
      regulator: 'Pharmacy and Poisons Board (PPB)',
      registered: 'NA',
      ongoing: '02'
    },
    {
      country: 'Zambia',
      regulator: 'Zambia Medicines Regulatory Authority (ZAMRA)',
      registered: 'NA',
      ongoing: '01'
    },
    {
      country: 'Ghana',
      regulator: 'Food and Drugs Authority (FDA)',
      registered: 'NA',
      ongoing: '20'
    },
    {
      country: 'Botswana',
      regulator: 'Botswana Medicines Regulatory Authority (BoMRA)',
      registered: 'NA',
      ongoing: '09'
    },
    {
      country: 'Gambia',
      regulator: 'Medicines Control Agency (MCA)',
      registered: 'NA',
      ongoing: '10'
    }
  ];

  // North America continent registration data
  const northAmericaRegistrationData = [
    {
      country: 'El Salvador',
      regulator: 'National Directorate of Medicines',
      registered: '11',
      ongoing: '03'
    },
    {
      country: 'Guatemala',
      regulator: 'Departamento de Regulacion y Control de Productos Farmacéuticos y Afines (DRCPFA)',
      registered: '35',
      ongoing: '04'
    },
    {
      country: 'Honduras',
      regulator: 'Health Regulation Agency (ARSA)',
      registered: '06',
      ongoing: '11'
    },
    {
      country: 'Nicaragua',
      regulator: 'National Health Regulatory Authority',
      registered: 'NA',
      ongoing: '01'
    },
    {
      country: 'Panama',
      regulator: 'Ministry of Health (MINSA)',
      registered: 'NA',
      ongoing: '10'
    },
    {
      country: 'Costa Rica',
      regulator: 'Ministry of Health (MOH)',
      registered: 'NA',
      ongoing: '18'
    },
    {
      country: 'Mexico',
      regulator: 'Comision Federal para la Proteccion contra Riesgos Sanitarios (COFEPRIS)',
      registered: 'NA',
      ongoing: '07'
    }
  ];

  // Quality Objectives (2025)
  const qualityObjectives = [
    {
      number: 1,
      title:
        'To register Truenat® CT/NG, Truenat® HCV under IVD Regulation (EU) 2017/746',
      indicators: [
        {
          name: 'Truenat® CT/NG under IVDR, 2017',
          tasks: [
            { id: 'T1', name: 'Certification by NB', allocated: 70, status: 'Ongoing', completed: 75 },
            { id: 'T2', name: 'EU DoC', allocated: 15, status: 'Ongoing', completed: 0 },
            { id: 'T3', name: 'Updation of Annex IV', allocated: 15, status: 'Ongoing', completed: 0 },
          ],
        },
        {
          name: 'Truenat® HCV under IVDR, 2017',
          tasks: [
            { id: 'T1', name: 'Technical Dossier preparation', allocated: 70, status: 'Ongoing', completed: 75 },
            { id: 'T2', name: 'Technical Dossier review by stakeholders', allocated: 15, status: 'Ongoing', completed: 0 },
            { id: 'T3', name: 'Technical Dossier submission to Notified Body', allocated: 15, status: 'Ongoing', completed: 0 },
          ],
        },
      ],
    },
    {
      number: 2,
      title:
        'Plan and implement EN ISO 14001:2015 [Environmental management systems — Requirements with guidance for use] at Molbio Diagnostics Limited',
      indicators: [
        {
          name: 'Gap Assessment',
          tasks: [
            { id: 'T1', name: 'Gap Analysis', allocated: 50, status: 'Completed', completed: 100 },
            { id: 'T2', name: 'Inter-department Meeting', allocated: 50, status: 'Ongoing', completed: 30 },
          ],
        },
        {
          name: 'Implementation',
          tasks: [
            { id: 'T1', name: 'Procedures developed in accordance with guidelines', allocated: 100, status: 'Ongoing', completed: 30 },
          ],
        },
      ],
    },
    {
      number: 3,
      title:
        'Plan and implement IEC 62366-1:2015 [Medical devices — Application of usability engineering to medical devices]',
      indicators: [
        {
          name: 'Gap Assessment',
          tasks: [
            { id: 'T1', name: 'Gap Analysis', allocated: 50, status: 'Completed', completed: 100 },
            { id: 'T2', name: 'Inter-department Meeting', allocated: 25, status: 'Completed', completed: 100 },
            { id: 'T3', name: 'Feedback Assessment and Conclusion', allocated: 25, status: 'Completed', completed: 100 },
          ],
        },
        {
          name: 'Implementation',
          tasks: [
            { id: 'T1', name: 'Procedures developed in accordance with guidelines', allocated: 100, status: 'Ongoing', completed: 30 },
          ],
        },
      ],
    },
  ];

  // South America continent registration data
  const southAmericaRegistrationData = [
    {
      country: 'Brazil',
      regulator: 'Agencia Nacional de Vigilancia Sanitaria (ANVISA)',
      registered: '03',
      ongoing: '04'
    },
    {
      country: 'Peru',
      regulator: 'Direccion General de Medicamentos, Insumos y Drogas (DIGEMID)',
      registered: '01',
      ongoing: '07'
    },
    {
      country: 'Colombia',
      regulator: 'National Food and Drug Surveillance Institute (INVIMA)',
      registered: 'NA',
      ongoing: '11'
    },
    {
      country: 'Paraguay',
      regulator: 'National Directorate of Health Surveillance (DINAVISA)',
      registered: 'NA',
      ongoing: '07'
    },
    {
      country: 'Bolivia',
      regulator: 'La Agencia Estatal de Medicamentos y Tecnologías en Salud (AGEMED)',
      registered: '09',
      ongoing: '01'
    }
  ];

  // Europe continent registration data
  const europeRegistrationData = [
    {
      country: 'United Kingdom',
      regulator: 'Medicines and Health care products Regulatory Agency (MHRA)',
      registered: 'NA',
      ongoing: '42'
    },
    {
      country: 'Romania',
      regulator: 'National Agency for Medicines and Medical Devices (NAMMD)',
      registered: 'NA',
      ongoing: '03'
    },
    {
      country: 'Azerbaijan',
      regulator: 'Analytical Expertise Center (AEC)',
      registered: 'NA',
      ongoing: '06'
    }
  ];

  // Products in Pipeline data (8 items)
  const pipelineProducts = [
    {
      no: '01',
      name: 'Truecyte',
      desc: 'AI based digital pathology',
      note: '(Awaiting product details)'
    },
    {
      no: '02',
      name: 'Trueamp Mini',
      desc: 'Real Time Multiplex qPCR Analyzer',
      note: '(Awaiting approved user manual)'
    },
    {
      no: '03',
      name: 'Trueamp HPV-HR Genotyping',
      desc: 'Real Time PCR Test for Human Papillomavirus High Risk Types 16/18/33/35, 31/39/45, 51/52/56/58, 59/66/68',
      note: '(Awaiting finalised product details)'
    },
    {
      no: '04',
      name: 'Truepoc MTB',
      desc: 'Rapid cartridge-based nucleic acid amplification test for detection of Mycobacterium Tuberculosis Complex (MTBc)',
      note: '(Application under process)'
    },
    {
      no: '05',
      name: 'Trueprep Mag V2',
      desc: '',
      note: '(Awaiting product details)'
    },
    {
      no: '06',
      name: 'Trueprep Mag V3',
      desc: '',
      note: '(Awaiting product details)'
    },
    {
      no: '07',
      name: 'Trueamp CureDx-TB',
      desc: 'Real-time reverse transcription polymerase chain reaction (RT-PCR) assay for the qualitative assessment of host-response mRNA biomarkers associated with Mycobacterium tuberculosis infection',
      note: '(Application under process)'
    },
    {
      no: '08',
      name: 'Truenat Ebola-Marburg',
      desc: 'Chip-based Real Time PCR Test for Ebola and Marburg virus',
      note: '(No provision for International Testing Sites)'
    }
  ];

  if (showDetailPage && activeSection === 2) {
    console.log('Rendering Inprocess Applications page, activeSection:', activeSection);
    return (
      <div className="detailPage inprocessPage">
        <div className="detailHeader">
          <button className="backButton" onClick={handleBackToMain}>← Back</button>
          <h1 className="detailTitle">2. Inprocess Applications (Overall)</h1>
          <img src="/molbio-black-logo.png" alt="Molbio" className="detailLogo" />
        </div>

        <div className="detailContent">
          {/* Circular Diagram */}
          <div className="circularDiagram">
            <div className="centerCircle">
              <span className="centerText">INPROCESS</span>
            </div>
            
            <div className="radiatingItem top">
              <h4>TEST LICENSE</h4>
              <p>Query responded: {inprocessData.counts.testLicenseResponded}</p>
              <p>Under query: {inprocessData.counts.testLicenseQuery}</p>
            </div>
            
            <div className="radiatingItem topRight">
              <h4>MANUFACTURING LICENSE</h4>
              <p>Query responded: {inprocessData.counts.mfgLicenseResponded}</p>
              <p>Under query: {inprocessData.counts.mfgLicenseQuery}</p>
            </div>
            
            <div className="radiatingItem right">
              <h4>CONDITION FULFILLMENT</h4>
              <p>Query responded: {inprocessData.counts.conditionResponded}</p>
              <p>Under query: {inprocessData.counts.conditionQuery}</p>
            </div>
            
            <div className="radiatingItem bottomRight">
              <h4>CLINICAL INVESTIGATION</h4>
              <p>Query responded: {inprocessData.counts.clinicalResponded}</p>
            </div>
            
            <div className="radiatingItem bottom">
              <h4>NEW IVD</h4>
              <p>Under query: {inprocessData.counts.newIVDQuery}</p>
            </div>
            
            <div className="radiatingItem left">
              <h4>RETENTION LICENSE</h4>
              <p>Query responded: {inprocessData.counts.retentionResponded}</p>
            </div>
          </div>

          {/* Table */}
          <div className="inprocessTable">
            <table>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Type of license</th>
                  <th>Product Name</th>
                  <th>Site</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inprocessData.table.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.no}</td>
                    <td>{row.type}</td>
                    <td>{row.name}</td>
                    <td>{row.site}</td>
                    <td>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (showDetailPage && activeSection === 3) {
    console.log('Rendering Products in Pipeline page, activeSection:', activeSection);
    return (
      <div className="detailPage pipelinePage">
        <div className="detailHeader">
          <button className="backButton" onClick={handleBackToMain}>← Back</button>
          <h1 className="detailTitle">3. Products in Pipeline</h1>
          <img src="/molbio-black-logo.png" alt="Molbio" className="detailLogo" />
        </div>

        <div className="detailContent">
          <div className="pipelineTimeline">
            <div className="timelineCenterLine" />
            {pipelineProducts.map((p, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={p.no}
                  className={`timelineRow ${isLeft ? 'left' : 'right'}`}
                  style={{ animationDelay: `${idx * 120}ms` }}
                >
                  {isLeft && (
                    <div className="timelineCard">
                      <h3 className="tCardTitle">{p.name}</h3>
                      {p.desc && <p className="tCardDesc">{p.desc}</p>}
                      {p.note && <p className="tCardNote">{p.note}</p>}
                    </div>
                  )}

                  <div className="timelineBadge">{p.no}</div>

                  {!isLeft && (
                    <div className="timelineCard">
                      <h3 className="tCardTitle">{p.name}</h3>
                      {p.desc && <p className="tCardDesc">{p.desc}</p>}
                      {p.note && <p className="tCardNote">{p.note}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (showDetailPage && activeSection === 4) {
    // Build pie chart using CSS conic-gradient
    const counts = {
      design: mlStatus.designFile.length,
      clinical: mlStatus.clinicalEvaluation.length,
      stability: mlStatus.stability.length,
      lots: mlStatus.lotsNotTaken.length,
      internal: mlStatus.internalValidation.length
    };
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const colors = {
      design: '#7dd3fc',
      clinical: '#f97316',
      stability: '#94a3b8',
      lots: '#facc15',
      internal: '#60a5fa'
    };
    const pct = Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, (v / total) * 100]));
    // Build gradient stops in clockwise order
    const gradient = (() => {
      let acc = 0;
      const s1 = `${colors.design} 0 ${acc += pct.design}%`;
      const s2 = `${colors.clinical} ${acc}% ${acc += pct.clinical}%`;
      const s3 = `${colors.stability} ${acc}% ${acc += pct.stability}%`;
      const s4 = `${colors.lots} ${acc}% ${acc += pct.lots}%`;
      const s5 = `${colors.internal} ${acc}% 100%`;
      return [s1, s2, s3, s4, s5].join(', ');
    })();

    const statusItems = [
      { label: 'Status', value: total },
      { label: 'Design Transfer File', value: counts.design },
      { label: 'Clinical Evaluation', value: counts.clinical },
      { label: 'Stability Study', value: counts.stability },
      { label: 'Lots not taken', value: counts.lots },
      { label: 'Internal Validation', value: counts.internal }
    ];

    return (
      <div className="detailPage mlStatusPage">
        <div className="detailHeader">
          <button className="backButton" onClick={handleBackToMain}>← Back</button>
          <h1 className="detailTitle">4. Manufacturing License Status (to be applied)</h1>
          <img src="/molbio-black-logo.png" alt="Molbio" className="detailLogo" />
        </div>

        <div className="detailContent">
          {/* Table at top */}
          <div className="mlBottomGrid">
            {/* Design File */}
            <div className="mlCol">
              <div className="mlPanel cyan">
                <div className="mlPanelHeader">DESIGN FILE <span className="mlCount">{mlStatus.designFile.length}</span></div>
                <ul className="mlList">
                  {mlStatus.designFile.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            </div>

            {/* Lots not taken */}
            <div className="mlCol">
              <div className="mlPanel amber">
                <div className="mlPanelHeader">LOTS NOT TAKEN <span className="mlCount">{mlStatus.lotsNotTaken.length}</span></div>
                <ul className="mlList">
                  {mlStatus.lotsNotTaken.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            </div>

            {/* Internal Validation & Stability */}
            <div className="mlCol">
              <div className="mlPanel slate">
                <div className="mlVerticalList">
                  <div className="mlBucket sky">
                    <div className="mlBucketHeader">Internal Validation <span className="mlCount">{mlStatus.internalValidation.length}</span></div>
                    <ul className="mlList compact">
                      {mlStatus.internalValidation.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                  <div className="mlBucket slateDark">
                    <div className="mlBucketHeader">Stability Study <span className="mlCount">{mlStatus.stability.length}</span></div>
                    <ul className="mlList compact">
                      {mlStatus.stability.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Evaluation */}
            <div className="mlCol">
              <div className="mlPanel orange">
                <div className="mlPanelHeader">CLINICAL EVALUATION <span className="mlCount">{mlStatus.clinicalEvaluation.length}</span></div>
                <ul className="mlList">
                  {mlStatus.clinicalEvaluation.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Chart at bottom */}
          <div className="mlChartRow">
            <div className="mlChartCard">
              <div className="mlChartTitle">Status</div>
              <div className="mlChartLayout">
                <div className="mlPie" style={{ background: `conic-gradient(${gradient})` }}>
                  <div className="mlPieHub">{total}</div>
                </div>
                <div className="mlStatusList">
                  <div className="mlStatusItem">
                    <span className="mlStatusItemLabel"><span className="sw" style={{background: colors.design}} />Design File</span>
                    <span className="mlStatusItemValue">{counts.design}</span>
                  </div>
                  <div className="mlStatusItem">
                    <span className="mlStatusItemLabel"><span className="sw" style={{background: colors.lots}} />Lots</span>
                    <span className="mlStatusItemValue">{counts.lots}</span>
                  </div>
                  <div className="mlStatusItem">
                    <span className="mlStatusItemLabel"><span className="sw" style={{background: colors.internal}} />Internal Validation</span>
                    <span className="mlStatusItemValue">{counts.internal}</span>
                  </div>
                  <div className="mlStatusItem">
                    <span className="mlStatusItemLabel"><span className="sw" style={{background: colors.stability}} />Stability</span>
                    <span className="mlStatusItemValue">{counts.stability}</span>
                  </div>
                  <div className="mlStatusItem">
                    <span className="mlStatusItemLabel"><span className="sw" style={{background: colors.clinical}} />Clinical</span>
                    <span className="mlStatusItemValue">{counts.clinical}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showDetailPage && activeSection === 1) {
    console.log('Rendering Approvals page, activeSection:', activeSection);
    return (
      <div className="detailPage">
        <div className="detailHeader">
          <button className="backButton" onClick={handleBackToMain}>← Back</button>
          <h1 className="detailTitle">1. Approvals & Submissions (July 2025 - December 2025)</h1>
          <img src="/molbio-black-logo.png" alt="Molbio" className="detailLogo" />
        </div>

        <div className="detailContent">
          <div className="dataGrid">
            {/* Left Category Labels */}
            <div className="categoryColumn">
              <div className="categoryCell header"></div>
              {licenseData.approved.map((item, idx) => (
                <div key={idx} className={`categoryCell ${item.category === 'Total' ? 'total' : ''}`}>
                  {item.category}
                </div>
              ))}
              {licenseData.approved[licenseData.approved.length - 1].category === 'Total' && (
                <div className="categoryCell badgeCell"></div>
              )}
            </div>

            {/* Submitted Column (first) */}
            <div className="dataColumn submitted">
              <div className="columnHeader">
                <h3>Submitted</h3>
              </div>
              {licenseData.submitted.map((item, idx) => (
                <div key={idx} className={`dataCell ${item.category === 'Total' ? 'total' : ''}`}>
                  {item.siteI && item.siteI !== 'NA' && <div className="siteData"><span className="siteName">Site I</span> - {item.siteI}</div>}
                  {item.siteV && <div className="siteData"><span className="siteName">Site V</span> - {item.siteV}</div>}
                  {item.siteI === 'NA' && <div className="siteData empty">NA</div>}
                  {!item.siteI && !item.siteV && <div className="siteData empty">-</div>}
                </div>
              ))}
              {licenseData.submitted[licenseData.submitted.length - 1].category === 'Total' && (
                <div className="dataCell badgeCell">
                  <img src="/submitted image.jpg" alt="Submitted" className="badgeIcon" />
                </div>
              )}
            </div>

            {/* Approved Column (second) */}
            <div className="dataColumn approved">
              <div className="columnHeader">
                <h3>Approved</h3>
              </div>
              {licenseData.approved.map((item, idx) => (
                <div key={idx} className={`dataCell ${item.category === 'Total' ? 'total' : ''}`}>
                  {item.siteI && <div className="siteData"><span className="siteName">Site I</span> - {item.siteI}</div>}
                  {item.siteV && <div className="siteData"><span className="siteName">Site V</span> - {item.siteV}</div>}
                  {!item.siteI && !item.siteV && <div className="siteData empty">-</div>}
                </div>
              ))}
              {licenseData.approved[licenseData.approved.length - 1].category === 'Total' && (
                <div className="dataCell badgeCell">
                  <img src="/Global regitrations/approved label.jpg" alt="Approved" className="badgeIcon" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="singlePageLayout">
      {/* Global loading overlay (fixed, covers entire app while images preload) */}
      {!imagesLoaded && <LoadingScreen progress={loadProgress} />}
      {/* Hero Section */}
      <section className="heroSection" ref={heroRef}>
        <div className="heroLeft">
          <h1 className="heroTitle">REGULATORY AFFAIRS</h1>
          <p className="heroSubtitle">By Regulatory Affairs Team</p>
          <div className="molbioLogoContainer">
            <img src="/molbio-black-logo.png" alt="Molbio Logo" className="molbioLogoBrand" />
          </div>
          <button className="ctaButton" onClick={scrollToContents}>Explore Contents →</button>
        </div>
        <div className="heroRight">
          <div className="buildingImage"></div>
        </div>
      </section>

      {/* Contents Section */}
      <section className="contentsSection" ref={contentsRef}>
        <div className="contentsHeader">
          <h1>CONTENTS</h1>
          <img src="/molbio-black-logo.png" alt="Molbio" className="headerLogo" />
        </div>
        
        <div className="contentsGrid">
          {contentItems.map((item, idx) => (
            <div key={item.id} className={`contentItem ${item.color} ${showSections ? 'reveal' : ''}`} style={{ animationDelay: `${idx * 0.15}s` }}>
              <div className="itemNumber">{item.id}</div>
              <div className="itemContent">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Licensing Section */}
      <section className="productLicensingSection" ref={productLicensingRef}>
        <div className="productHeader">
          <img src="/molbio-black-logo.png" alt="Molbio" className="headerLogo" />
        </div>
        <div className={`productLicensingLayout ${showSections ? 'splitView' : ''}`}>
          <div className="productLeftColumn">
            <div className="productContent">
              <h1 className="productTitle">Product Licensing</h1>
              <p className="productSubtitle">Central and State Licensing Authority</p>
              <p className="productDate">July 2025 - December 2025</p>
            </div>
            
          </div>
          
          {/* Section Navigation Buttons */}
          {showSections && (
            <div className="licensingSectionsGrid">
              {licensingSections.map((section, index) => (
                <div 
                  key={section.id} 
                  className="licensingSection"
                  style={{ animationDelay: `${index * 0.15}s` }}
                  onClick={() => handleSectionClick(section.id)}
                >
                  <span className="sectionNumber">{section.id}</span>
                  <h3>{section.title}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Global Registrations Section */}
      <section className={showGlobalRegAnimation ? "globalRegistrationsSection animated" : "globalRegistrationsSection"} ref={globalRegistrationsRef}>
        {/* Centered content (first 0.5s) */}
        {!showGlobalRegAnimation && (
          <div className="grCentered">
            <div className="grHeaderLogo">
              <img src="/molbio-black-logo.png" alt="Molbio" className="headerLogo" />
            </div>
            <h1 className="grTitle">Global Registrations</h1>
            <p className="grDate">July 2025 - December 2025</p>
          </div>
        )}
        
        {/* Header and body sections (fade in after 0.5s) */}
        {showGlobalRegAnimation && (
          <div className="grLayoutContainer">
            {/* Red Header Section */}
            <div className="grHeaderTop">
              <div className="grHeaderContent">
                <h1 className="grTitleHeader">Global Registrations</h1>
                <p className="grDateHeader">July 2025 - December 2025</p>
              </div>
              <img src="/molbio-black-logo.png" alt="Molbio" className="grHeaderLogo" />
            </div>
            
            {/* Divider */}
            <div className="grDivider" />
            
            {/* South America Table - Top Right Corner (only when South America slide is active) */}
            {currentGlobalImage === 5 && showSouthAmericaTable && (
              <div className="southAmericaTopRightTable">
                <table className="southAmericaQuickTable">
                  <thead>
                    <tr>
                      <th>Country</th>
                      <th>Regulator</th>
                      <th>Registered</th>
                      <th>Ongoing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {southAmericaRegistrationData.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.country}</td>
                        <td>{row.regulator}</td>
                        <td>{row.registered}</td>
                        <td>{row.ongoing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* White Body Section */}
            <div className="grBody">
              <div className="grMapContainer">
                <img 
                  src={
                    currentGlobalImage === 1 
                      ? "/Global regitrations/01.png" 
                      : currentGlobalImage === 2 
                      ? "/Global regitrations/02.png"
                      : currentGlobalImage === 3
                      ? "/Global regitrations/03.png"
                      : currentGlobalImage === 4
                      ? "/Global regitrations/04.png"
                      : currentGlobalImage === 5
                      ? "/Global regitrations/05.png"
                      : "/Global regitrations/06.png"
                  } 
                  alt="Global Registrations" 
                  className="grMapImage" 
                />
                
                {/* Asia Registration Table */}
                {showAsiaTable && currentGlobalImage === 2 && (
                  <div className="asiaTableContainer">
                  <table className="asiaTable">
                    <thead>
                      <tr>
                        <th>Country</th>
                        <th>Regulator</th>
                        <th>No. of products registered</th>
                        <th>No. of products (Registration Ongoing)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asiaRegistrationData.map((row, idx) => (
                        <tr key={idx}>
                          <td>{row.country}</td>
                          <td>{row.regulator}</td>
                          <td>{row.registered}</td>
                          <td>{row.ongoing}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Africa Registration Table */}
              {showAfricaTable && currentGlobalImage === 3 && (
                <div className="africaTableContainer">
                  <table className="africaTable">
                    <thead>
                      <tr>
                        <th>Country</th>
                        <th>Regulator</th>
                        <th>No. of products registered</th>
                        <th>No. of products (Registration Ongoing)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {africaRegistrationData.map((row, idx) => (
                        <tr key={idx}>
                          <td>{row.country}</td>
                          <td>{row.regulator}</td>
                          <td>{row.registered}</td>
                          <td>{row.ongoing}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* North America Registration Table */}
              {showNorthAmericaTable && currentGlobalImage === 4 && (
                <div className="northAmericaTableContainer">
                  <table className="northAmericaTable">
                    <thead>
                      <tr>
                        <th>Country</th>
                        <th>Regulator</th>
                        <th>No. of products registered</th>
                        <th>No. of products (Registration Ongoing)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {northAmericaRegistrationData.map((row, idx) => (
                        <tr key={idx}>
                          <td>{row.country}</td>
                          <td>{row.regulator}</td>
                          <td>{row.registered}</td>
                          <td>{row.ongoing}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              
              {/* Europe Registration Table */}
              {showEuropeTable && currentGlobalImage === 6 && (
                <div className="europeTableContainer">
                  <table className="europeTable">
                    <thead>
                      <tr>
                        <th>Country</th>
                        <th>Regulator</th>
                        <th>No. of products registered</th>
                        <th>No. of products (Registration Ongoing)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {europeRegistrationData.map((row, idx) => (
                        <tr key={idx}>
                          <td>{row.country}</td>
                          <td>{row.regulator}</td>
                          <td>{row.registered}</td>
                          <td>{row.ongoing}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Next button to WHO Technical Dossier - only show at last image */}
              {currentGlobalImage === 6 && (
                <button className="whoNextBtn" onClick={scrollToWhoTechnical}>
                  NEXT
                </button>
              )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* WHO Technical Dossier Section */}
      <section className={showWhoTimeline ? "whoTechnicalSection animated" : "whoTechnicalSection"} ref={whoTechnicalRef}>
        <div className="whoTechnicalContainer">
          <div className={showWhoTimeline ? "whoTechnicalHeader animated" : "whoTechnicalHeader"}>
            <img src="/molbio-black-logo.png" alt="Molbio" className="whoHeaderLogo" />
            <h1 className="whoTechnicalTitle">WHO Technical dossier</h1>
            <p className="whoTechnicalSubtitle">Section-Wise Schedule for Technical dossier(TD) and Related documents</p>
          </div>
          
          {showWhoTimeline && (
            <div className="whoBodyContent">
              {showWhoImageOnly && (
                <div className="whoImageDisplayContainer">
                  <img src="/WHO/who.png" alt="WHO Logo" className="whoImageDisplay" />
                </div>
              )}
              {showWhoContent && (
                <>
                {activeWhoTimeline === 'mtbplus' ? (
                <div className="whoTimelineTextContent">
                <h2 className="whoTimelineMainTitle">Month-wise progress for Truenat<sup>®</sup> MTB Plus WHO PreQ TD Submission</h2>
                
                <div className="whoHorizontalTimeline">
                  {/* July to October Phase */}
                  <div className="whoTimelinePhaseHorizontal completed">
                    <div className="whoPhaseIndicatorHorizontal">
                      <div className="whoPhaseIconHorizontal completed">✓</div>
                      <div className="whoPhasePeriodHorizontal">July to October</div>
                    </div>
                    <div className="whoPhaseContentHorizontal">
                      <ul className="whoPhaseTasksListHorizontal">
                        <li><span className="whoTaskBullet"></span>Coordination with cross functional teams for data as per GAP assessment prepared</li>
                        <li><span className="whoTaskBullet"></span>Verification and finalization of analytical performance study data</li>
                        <li><span className="whoTaskBullet"></span>Artwork review and verification for compliance.</li>
                        <li><span className="whoTaskBullet"></span>Preparation of sections for Technical Dossier (TD)</li>
                        <li><span className="whoTaskBullet"></span>Compilation of TD with supporting documents</li>
                        <li><span className="whoTaskBullet"></span>Review of TD sections stakeholders</li>
                        <li><span className="whoTaskBullet"></span>Preparation of the pre submission form</li>
                      </ul>
                    </div>
                  </div>

                  <div className="whoHorizontalConnector"></div>

                  {/* October to November Phase */}
                  <div className="whoTimelinePhaseHorizontal completed">
                    <div className="whoPhaseIndicatorHorizontal">

                      <div className="whoPhaseIconHorizontal completed">✓</div>
                      <div className="whoPhasePeriodHorizontal">October to November</div>
                    </div>
                    <div className="whoPhaseContentHorizontal">
                      <ul className="whoPhaseTasksListHorizontal">
                        <li><span className="whoTaskBullet"></span>Finalization and submission of pre submission form</li>
                        <li><span className="whoTaskBullet"></span>Allotment of PreQ number (07/10/2025)</li>
                        <li><span className="whoTaskBullet"></span>Pre submission call with WHO</li>
                        <li><span className="whoTaskBullet"></span>Signing of Letter of Agreement</li>
                        <li><span className="whoTaskBullet"></span>Fees payment (26/11/2025)</li>
                        <li><span className="whoTaskBullet"></span>Updating and compilation of TD with all review comments</li>
                        <li><span className="whoTaskBullet"></span>Submission of TD to WHO (27/11/2025)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="whoHorizontalConnector"></div>

                  {/* December Phase */}
                  <div className="whoTimelinePhaseHorizontal inprocess">
                    <div className="whoPhaseIndicatorHorizontal">
                      <div className="whoPhaseIconHorizontal inprocess">◐</div>
                      <div className="whoPhasePeriodHorizontal">December</div>
                    </div>
                    <div className="whoPhaseContentHorizontal">
                      <ul className="whoPhaseTasksListHorizontal">
                        <li><span className="whoTaskBullet"></span>1st Dossier Screening of WHO received (5/12/2025)</li>
                        <li><span className="whoTaskBullet"></span>Review provided by WHO PreQ team is corrected, awaiting CAP1 from WHO Team If any.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              ) : (
                <div className="whoTimelineTextContent">
                  <h2 className="whoTimelineMainTitle">Preparation & Review Progress Track for Truenat<sup>®</sup> MTB RIF Dx WHO PreQ Submission</h2>
                  
                  <div className="whoHorizontalTimeline">
                    {/* 01/12/25 - 02/12/25 Phase */}
                    <div className="whoTimelinePhaseHorizontal completed">
                      <div className="whoPhaseIndicatorHorizontal">
                        <div className="whoPhaseIconHorizontal completed">✓</div>
                        <div className="whoPhasePeriodHorizontal">01/12/25 - 02/12/25</div>
                      </div>
                      <div className="whoPhaseContentHorizontal">
                        <ul className="whoPhaseTasksListHorizontal">
                          <li><span className="whoTaskBullet"></span>Preparation and sharing of EP checklists</li>
                          <li><span className="whoTaskBullet"></span>Reviewing of documents</li>
                          <li><span className="whoTaskBullet"></span>Sharing of Analytical study summary for review</li>
                          <li><span className="whoTaskBullet"></span>Incorporation of reviewed content and sharing for second review</li>
                        </ul>
                      </div>
                    </div>

                    <div className="whoHorizontalConnector"></div>

                    {/* 03/12/25 - 04/12/25 Phase */}
                    <div className="whoTimelinePhaseHorizontal completed">
                      <div className="whoPhaseIndicatorHorizontal">
                        <div className="whoPhaseIconHorizontal completed">✓</div>
                        <div className="whoPhasePeriodHorizontal">03/12/25 - 04/12/25</div>
                      </div>
                      <div className="whoPhaseContentHorizontal">
                        <ul className="whoPhaseTasksListHorizontal">
                          <li><span className="whoTaskBullet"></span>Sharing of Section 6.0 and Stability summary data for review</li>
                          <li><span className="whoTaskBullet"></span>Incorporating review comments and sharing for second review</li>
                          <li><span className="whoTaskBullet"></span>Sharing section 1.0 for review</li>
                        </ul>
                      </div>
                    </div>

                    <div className="whoHorizontalConnector"></div>

                    {/* 05/12/25 - 06/12/25 Phase */}
                    <div className="whoTimelinePhaseHorizontal completed">
                      <div className="whoPhaseIndicatorHorizontal">
                        <div className="whoPhaseIconHorizontal completed">✓</div>
                        <div className="whoPhasePeriodHorizontal">05/12/25 - 06/12/25</div>
                      </div>
                      <div className="whoPhaseContentHorizontal">
                        <ul className="whoPhaseTasksListHorizontal">
                          <li><span className="whoTaskBullet"></span>Incorporating all received comments and resharing section 1 and 2</li>
                          <li><span className="whoTaskBullet"></span>Sharing Section 4.0 (Clinical evidence) for review</li>
                          <li><span className="whoTaskBullet"></span>Sharing of Analytical summary for third review</li>
                          <li><span className="whoTaskBullet"></span>Review of Artwork (Pouch) received</li>
                          <li><span className="whoTaskBullet"></span>Finalization and submission of pre submission form</li>
                          <li><span className="whoTaskBullet"></span>Pre submission call with WHO</li>
                          <li><span className="whoTaskBullet"></span>Allotment of PreQ number (05/12/25)</li>
                          <li><span className="whoTaskBullet"></span>Signing of Letter of Agreement</li>
                        </ul>
                      </div>
                    </div>

                    <div className="whoHorizontalConnector"></div>

                    {/* 08/12/25 - Till date Phase */}
                    <div className="whoTimelinePhaseHorizontal inprocess">
                      <div className="whoPhaseIndicatorHorizontal">
                        <div className="whoPhaseIconHorizontal inprocess">◐</div>
                        <div className="whoPhasePeriodHorizontal">08/12/25 - Till date</div>
                      </div>
                      <div className="whoPhaseContentHorizontal">
                        <ul className="whoPhaseTasksListHorizontal">
                          <li><span className="whoTaskBullet"></span>Review of Pack insert (Intended)</li>
                          <li><span className="whoTaskBullet"></span>Preparation of Risk documents</li>
                          <li><span className="whoTaskBullet"></span>Compilation of annexures</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Removed internal next button to enforce global navigation only */}
              </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Quality Objectives Section */}
      <section className="qualityObjectivesSection" ref={qualityObjectivesRef}>
        <div className="qualityObjectivesContainer">
          {showQualityFlash && (
            <div className="qoCentered">
              <div className="qoCenterTitle">Quality Objectives — 2025</div>
            </div>
          )}
          {!showQualityFlash && (
            <>
            <img src="/molbio-black-logo.png" alt="Molbio" className="qualityHeaderLogo" />
          <div className="qualityObjectivesHeader">
            <h1 className="qualityObjectivesTitle">Quality Objectives — 2025</h1>
          </div>
          <div className="qualityObjectivesBody">
            {/* Always show 3 cards at top */}
            <div className="qoSummaryGrid">
              {qualityObjectives.map((obj) => (
                <button 
                  className={`qoSummaryCard ${activeQualityObj && activeQualityObj.number === obj.number ? 'active' : ''}`} 
                  key={obj.number} 
                  onClick={() => openQualityDetail(obj)}
                >
                  <span className="qoBadge">Objective {obj.number}</span>
                  <h3 className="qoCardTitle">{obj.title}</h3>
                  <p className="qoCardDesc">Click to view details</p>
                  <span className="qoCardCta">View details →</span>
                </button>
              ))}
            </div>

            {/* Overview cards when nothing is selected */}
            {!activeQualityObj && (
              <div className="qoOverviewSection">
                <h2 className="qoOverviewTitle">Overview</h2>
                <div className="qoOverviewGrid">
                  {qualityObjectives.map((obj) => {
                    const metrics = getObjectiveMetrics(obj);
                    return (
                      <div className="qoOverviewCard" key={obj.number}>
                        <div className="qoOverviewHeader">
                          <span className="qoBadge">Objective {obj.number}</span>
                          <div className="qoOverviewProgress">{metrics.overallProgress}%</div>
                        </div>
                        <div className="qoOverviewStats">
                          <div className="qoOverviewStat">
                            <div className="qoOverviewStatValue">{metrics.totalTasks}</div>
                            <div className="qoOverviewStatLabel">Total Tasks</div>
                          </div>
                          <div className="qoOverviewStat">
                            <div className="qoOverviewStatValue">{metrics.completedTasks}</div>
                            <div className="qoOverviewStatLabel">Completed</div>
                          </div>
                          <div className="qoOverviewStat">
                            <div className="qoOverviewStatValue">{metrics.ongoingTasks}</div>
                            <div className="qoOverviewStatLabel">Ongoing</div>
                          </div>
                        </div>
                        <div className="qoProgress">
                          <div className="progressTrack">
                            <div className="progressFill" style={{ width: `${metrics.overallProgress}%` }} />
                          </div>
                        </div>
                        <div className="qoOverviewIndicators">
                          {obj.indicators.map((ind, idx) => (
                            <div className="qoOverviewIndicator" key={idx}>
                              <span className="qoOverviewIndicatorName">QI-{idx + 1}: {ind.name.split(' ')[0]}...</span>
                              <span className="qoOverviewIndicatorPercent">{metrics.indicatorProgress[idx]}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Show details below if a card is clicked */}
            {activeQualityObj && (
              <div className="qoDetail">
                <div className="qoDetailHeader">
                  <span className="qoBadge">Objective {activeQualityObj.number}</span>
                  <h3 className="qoTitle">{activeQualityObj.title}</h3>
                </div>
                <div className={`qoIndicators ${activeQualityObj.indicators && activeQualityObj.indicators.length === 2 ? 'two' : ''}`}>
                  {activeQualityObj.indicators.map((ind, idx) => {
                    const allocatedTotal = ind.tasks.reduce((acc, t) => acc + (t.allocated || 0), 0);
                    const weightedCompleted = ind.tasks.reduce((acc, t) => acc + ((t.completed || 0) * (t.allocated || 0)) / 100, 0);
                    const progress = allocatedTotal ? Math.round((weightedCompleted / allocatedTotal) * 100) : 0;
                    return (
                      <div className="qoIndicator" key={idx}>
                        <div className="qoIndicatorBadge">QI-{idx + 1}</div>
                        <div className="qoIndicatorHeader">
                          <h4 className="qoIndicatorTitle">{ind.name}</h4>
                          <div className="qoIndicatorPercent">{progress}%</div>
                          <div className="qoProgress small">
                            <div className="progressTrack"><div className="progressFill" style={{ width: `${progress}%` }} /></div>
                          </div>
                        </div>
                        <div className="qoTaskTable">
                          <div className="qoTaskRow qoTaskHead">
                            <div>Task</div>
                            <div>Allocated %</div>
                            <div>Status</div>
                            <div>Completed %</div>
                          </div>
                          {ind.tasks.map((t) => (
                            <div className="qoTaskRow" key={t.id}>
                              <div className="qoTaskName"><span className="qoTaskId">{t.id}</span> {t.name}</div>
                              <div>{t.allocated}%</div>
                              <div><span className={`statusPill ${t.status.toLowerCase()}`}>{t.status}</span></div>
                              <div>{t.completed}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          </>
          )}
        </div>
      </section>

      {/* Implementation Section */}
      <section className={`implementationSection ${showImplMain ? 'active' : ''}`} ref={implementationRef}>
        {/* Top-right logo when main view is active */}
        {showImplMain && (
          <img src="/molbio-black-logo.png" alt="Molbio" className="implTopRightLogo" />
        )}

        {/* Centered splash for 0.5s */}
        {showImplIntro && !showImplMain && (
          <div className="implCentered">
            <div className="implCenterTitle">IMPLEMENTATION</div>
            <div className="implCenterDates">
              <div>July 2025</div>
              <div>December 2025</div>
            </div>
          </div>
        )}

        {/* Certificates centered splash for 0.5s */}
        {showCertIntro && (
          <div className="implCentered certSplash">
            <div className="implCenterTitle">QMS CERTIFICATES - July 2025 - December 2025</div>
          </div>
        )}

        {/* Main header + body after splash */}
        {showImplMain && !showCertIntro && (
          <>
            {currentImplImage !== 4 && (
              <div className="implementationHeader">
                <h1 className="implTitle">{currentImplImage === 3 ? 'QMS CERTIFICATES - July 2025 - December 2025' : 'IMPLEMENTATION - July 2025 - December 2025'}</h1>
              </div>
            )}
          <div className="implementationBody">
              {currentImplImage < 3 ? (
                <div className="implImageWrap">
                  <img src={`/implementation${currentImplImage}.png`} alt="Implementation Overview" className="implBodyImage" />
                </div>
              ) : showCertMain ? (
                <div className="certificationsSlide">
                  <div className="certIntro">
                    <div className="certSubtitle">Successfully achieved QMS certificates</div>
                  </div>
                  <div className="certGrid">
                    <div className="certCard">
                      <div className="certHeading">MDSAP Certificate</div>
                      <div className="certTop">
                        <img src={slide3303} alt="MDSAP Logo" className="certLogo" />
                      </div>
                      <img src="/certtificates/MDSAP.png" alt="MDSAP Certificate" className="certImage" />
                      <div className="certText">
                        <div className="certTitle">MDSAP Certificate</div>
                        <div>Valid from: 11/07/2025</div>
                        <div>Valid until: 25/07/2026</div>
                      </div>
                    </div>

                    <div className="certCard">
                      <div className="certHeading">EU IVDR</div>
                      <div className="certTop">
                        <img src={slide3302} alt="EU IVDR Logo" className="certLogo" />
                      </div>
                      <img src="/certtificates/EVIVDR.png" alt="EU IVDR Certificate" className="certImage" />
                      <div className="certText">
                        <div className="certTitle">EU IVDR Certificate</div>
                        <div>Valid from: 26/08/2025</div>
                        <div>Valid until: 25/08/2030</div>
                      </div>
                    </div>

                    <div className="certCard">
                      <div className="certHeading">ISO 13485</div>
                      <div className="certTop">
                        <img src={slide3301} alt="ISO Logo" className="certLogo certLogoLarge" />
                      </div>
                      <img src="/certtificates/ISO.png" alt="ISO Certificate" className="certImage" />
                      <div className="certText">
                        <div className="certTitle">ISO Certificate</div>
                        <div>Valid from: 09/07/2025</div>
                        <div>Valid until: 26/04/2026</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : currentImplImage === 4 ? (
                <div className="thankYouPage">
                  <div className="thankYouContent">
                    <h1 className="thankYouTitle">Thank You!</h1>
                  </div>
                </div>
              ) : null}
          </div>
          </>
        )}
      </section>

      {/* Fixed Navigation Buttons */}
      {showBackButton && (
        <div className="globalNavButtons">
          <button className="globalBackButton" onClick={goBack}>
            ←
          </button>
          {currentImplImage !== 4 && (
            <button className="globalNextButton" onClick={goForward}>
              →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
