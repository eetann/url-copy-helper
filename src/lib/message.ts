import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
	makeChangeIcon(): void;
}

export const { sendMessage, onMessage } =
	defineExtensionMessaging<ProtocolMap>();
