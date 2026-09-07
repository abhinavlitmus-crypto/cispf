import React, { useState } from "react";
import { Card, Divider, Input, Button, Tooltip, message } from "antd";
import { MessageCircle, X, Send } from "lucide-react";
import { useSendQueryMutation } from "../../../query/sendQuery.query"
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_SEND_QUERY } from "../../../constants/query.constants";
import commonObj from "../../../commonObj";
import "./helpBot.css";

const QUICK_QUESTIONS = [
    "How do I add a new client?",
    "How can I edit client details?",
    "Where can I export reports?",
    "Who can delete records?",
    "How does role access work?",
];

export default function HelpBot() {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const queryClient = useQueryClient();
    const sendQueryMutation = useSendQueryMutation();

    const handleSend = () => {
        if (!text.trim()) return;
        const dateOnly = () => {
			const d = new Date();
			d.setHours(0, 0, 0, 0);
			return d;
		};

		const todayDate = dateOnly();

        const payload = {
            query: text.trim(),
            clientId : commonObj?._id ,
            clientName : commonObj?.name,
            clientUserType : commonObj?.userType,
            assignDate : todayDate,
        }
        sendQueryMutation.mutate(payload, {
            onSuccess: () => {
                message.success("Query sent successfully");
                queryClient.invalidateQueries({
                    queryKey: [QUERY_SEND_QUERY],
                });
                setText("");
                setOpen(false);
            },
            onError: (err) => {
                if (typeof err?.message === "string") {
                    message.error(err.message);
                } else {
                    message.error(
                        err?.message?.[Object.keys(err.message)[0]]?.[0] ||
                        "Something went wrong"
                    );
                }
            },
        });
    };

    return (
        <>
            {/* Floating Button */}
            <Tooltip title="Send">
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-[2000] h-14 w-14 rounded-full bg-[#2B409B]
                    flex items-center justify-center text-white shadow-xl
                    hover:scale-110 transition-all animate-helpbot-pulse"
                >
                    <MessageCircle size={26} />
                </button>
            </Tooltip>

            {/* Popup */}
            {open && (
                <div className="fixed bottom-24 right-6 z-[2000] w-[340px] animate-helpbot-slide">
                    <Card
                        bordered={false}
                        className="rounded-xl shadow-2xl"
                        style={{padding : 0}}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-[#2B409B] rounded-t-xl">
                            <span className="text-white font-semibold">
                                Varhad Support
                            </span>
                            <X
                                size={18}
                                className="text-white cursor-pointer"
                                onClick={() => setOpen(false)}
                            />
                        </div>

                        {/* Quick Suggestions */}
                        <div className="p-3 flex flex-wrap gap-2 bg-white">
                            {QUICK_QUESTIONS.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => setText(q)}
                                    className="text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                        <Divider className="my-1" />

                        {/* Input */}
                        <div className="p-4 space-y-3">
                            <Input.TextArea
                                rows={3}
                                placeholder="Type your query here…"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />

                            <div className="flex justify-end">
                                <Button
                                    type="primary"
                                    disabled={!text.trim()}
                                    onClick={handleSend}
                                    className="flex items-center justify-center"
                                    size="large"
                                    icon={<Send size={16} />}
                                >
                                    Send
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}
