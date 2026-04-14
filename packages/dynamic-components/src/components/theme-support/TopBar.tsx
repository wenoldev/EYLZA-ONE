import type { HeaderConfig } from '../../types/Header';

const TopBar = ({ config }: { config: HeaderConfig }) => {
    if (!config.topBar?.show) return null;

    return (
        <div
            className="text-white text-[10px] md:text-[11px] uppercase tracking-widest font-bold h-8 md:h-10 overflow-hidden"
            style={{
                backgroundColor: config.topBar.backgroundColor || config.general.backgroundColor,
                color: config.topBar.textColor || config.general.textColor,
            }}
        >
            <div className="h-full px-4 md:px-6 flex items-center justify-center relative">
                <div className="md:block hidden whitespace-nowrap" dangerouslySetInnerHTML={{ __html: config.topBar.content }} />
                
                {/* Mobile Marquee */}
                <div className="md:hidden block w-full overflow-hidden">
                    <div className="flex animate-marquee whitespace-nowrap gap-8">
                        <div dangerouslySetInnerHTML={{ __html: config.topBar.content }} />
                        <div dangerouslySetInnerHTML={{ __html: config.topBar.content }} />
                        <div dangerouslySetInnerHTML={{ __html: config.topBar.content }} />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: inline-flex;
                    animation: marquee 15s linear infinite;
                    width: max-content;
                }
                /* Repeat content 3 times in marquee to ensure seamless loop */
                .animate-marquee > div {
                    padding-right: 2rem;
                }
            `}</style>
        </div>
    );
};

export default TopBar;
