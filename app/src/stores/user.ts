import { LinkedAccountWithMetadata, User } from "@privy-io/react-auth";
import { proxy, useSnapshot } from "valtio";
import { getAccessToken } from "@privy-io/react-auth";
import { callAPI } from "@/utils/api";

const state = proxy({
    privy: {} as User | null,
    authorized: false as boolean,
    data: {} as any,
    name: null as string | null,
    privyAccessToken: null as string | null,
    isOnboarded: false,
    isLoggingIn: false,
    wallet: [],

    reset: () => {
        state.privy = null;
        state.authorized = false;
        state.data = null as {} | null;
        state.name = null;
        state.privyAccessToken = null;
        state.isOnboarded = false;
        state.isLoggingIn = false;
        state.wallet = [];
    },

    login: async ({ user }: { user: User }) => {
        state.isLoggingIn = true;
        state.privy = user;
        state.privyAccessToken = await getAccessToken();
        state.setName();
        await state.authorizeUser();
        state.isLoggingIn = false;
        return true;
    },

    logout: () => {
        state.reset();
        return true;
    },

    setName: () => {
        if (!state.privy) return;
        if (state.privy.apple) state.name = state.privy.apple.email;
        else if (state.privy.discord) state.name = state.privy.discord.username;
        else if (state.privy.email) state.name = state.privy.email.address;
        else if (state.privy.farcaster)
            state.name = state.privy.farcaster.username;
        else if (state.privy.github) state.name = state.privy.github.username;
        else if (state.privy.google) state.name = state.privy.google.email;
        else if (state.privy.instagram)
            state.name = state.privy.instagram.username;
        else if (state.privy.linkedin) state.name = state.privy.linkedin.email;
        else if (state.privy.phone) state.name = state.privy.phone.number;
        else if (state.privy.spotify) state.name = state.privy.spotify.email;
        else if (state.privy.twitter) state.name = state.privy.twitter.username;
        else if (state.privy.wallet) state.name = state.privy.wallet.address;
        else state.name = "";
    },

    authorizeUser: async () => {
        //update wallet address in backend, and then request for drip if not done, and then set authorized to true
        try {
            let response = await callAPI("/user/authenticate", "POST", {
                name: state.name,
            });

            if (response.status != true || !response.response.user) {
                throw new Error("Failed to authenticate user");
            }

            state.data = response.response.user;
            state.wallet = response.response.user.Wallet;
            state.authorized = true;
            state.isLoggingIn = false;
        } catch (err) {
            console.error(err);
        }
    },

    refreshAccessToken: async () => {
        state.privyAccessToken = await getAccessToken();
        if (!state.privyAccessToken) {
            state.logout();
        }
    },
});

function useUser() {
    const snap = useSnapshot(state);
    return snap;
}

export { state as User, useUser };
