export type GaEventSenderData = {
    eventCategory: string;
    eventAction: string;
    eventLabel?: string;
};

export default (eventData: GaEventSenderData) => {
    try {
        window.dataLayer.push({ event: 'autoEvent', ...eventData });
    } catch (error) {
        console.error(error);
    }
};
