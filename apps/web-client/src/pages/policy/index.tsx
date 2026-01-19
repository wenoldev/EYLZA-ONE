import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { api } from "@/lib/api";
import ShadeLoader from "@/components/loader/ShadeLoader";

export default function PolicyPage() {
    const { policyId } = useParams();
    const { store } = useStore();
    const [policy, setPolicy] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPolicy = async () => {
            if (!store?.id || !policyId) return;

            setLoading(true);
            try {
                // Map readable URL slugs to backend policy names if necessary
                // For now assuming policyId matches backend 'name' (e.g. privacy-policy)
                const response = await api.get(`/public/stores/${store.id}/policies/${policyId}`);
                console.log({ response });

                if (response) {
                    setPolicy(response);
                } else {
                    setError("Policy not found");
                }
            } catch (err: any) {
                console.error("Error fetching policy:", err);
                setError(err.message || "Failed to load policy");
            } finally {
                setLoading(false);
            }
        };

        fetchPolicy();
    }, [store?.id, policyId]);

    if (loading) return <div className="max-w-4xl mx-auto py-20 px-4"><ShadeLoader /></div>;
    if (error || !policy) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Policy not found</h1>
                <p className="mt-4 text-gray-600">The policy you are looking for does not exist or has not been published yet.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-16 px-6 sm:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 pb-4">
                {policy.label || policy.name.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </h1>
            <div
                className="prose prose-blue max-w-none prose-p:leading-relaxed prose-headings:text-gray-900"
                dangerouslySetInnerHTML={{ __html: policy.content }}
            />

            <div className="mt-12 pt-8 text-sm text-gray-500">
                Last updated: {new Date(policy.updated_at).toLocaleDateString()}
            </div>
        </div>
    );
}
