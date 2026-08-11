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
                    display: flex;
                    animation: marquee 20s linear infinite;
                    width: max-content;
                }
                .animate-marquee > div {
                    display: flex;
                    align-items: center;
                    padding-right: 4rem;
                }
            `}</style>
        </div>
    );
};

export default TopBar;
