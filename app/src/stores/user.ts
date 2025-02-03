import { LinkedAccountWithMetadata, User } from "@privy-io/react-auth";
import { proxy, useSnapshot } from "valtio";
import { getAccessToken } from "@privy-io/react-auth";
import { callAPI } from "@/utils/api";

const state = proxy({
    privy: {} as User | null,
    authorized: false as boolean,
    user: {} as any,
    welcomeName: null as string | null,
    privyAccessToken: null as string | null,
    isOnboarded: false,
    isLoggingIn: false,

    reset: () => {
        state.privy = null;
        state.authorized = false;
        state.user = null as {} | null;
        state.welcomeName = null;
        state.privyAccessToken = null;
        state.isOnboarded = false;
        state.isLoggingIn = false;
    },

    login: async ({
        user,
        isNewUser,
        wasAlreadyAuthenticated,
        loginMethod,
        loginAccount,
    }: {
        user: User;
        isNewUser: boolean;
        wasAlreadyAuthenticated: boolean;
        loginMethod: any | null;
        loginAccount: LinkedAccountWithMetadata | null;
    }) => {
        state.isLoggingIn = true;
        state.privy = user;
        state.privyAccessToken = await getAccessToken();
        await state.authorizeUser();
        state.setWelcomeName();
        state.isLoggingIn = false;
        return true;
    },

    logout: () => {
        state.reset();
        return true;
    },

    setWelcomeName: () => {
        if (!state.privy) return;
        if (state.privy.apple) state.welcomeName = state.privy.apple.email;
        else if (state.privy.discord)
            state.welcomeName = state.privy.discord.username;
        else if (state.privy.email)
            state.welcomeName = state.privy.email.address;
        else if (state.privy.farcaster)
            state.welcomeName = state.privy.farcaster.username;
        else if (state.privy.github)
            state.welcomeName = state.privy.github.username;
        else if (state.privy.google)
            state.welcomeName = state.privy.google.email;
        else if (state.privy.instagram)
            state.welcomeName = state.privy.instagram.username;
        else if (state.privy.linkedin)
            state.welcomeName = state.privy.linkedin.email;
        else if (state.privy.phone)
            state.welcomeName = state.privy.phone.number;
        else if (state.privy.spotify)
            state.welcomeName = state.privy.spotify.email;
        else if (state.privy.twitter)
            state.welcomeName = state.privy.twitter.username;
        else if (state.privy.wallet)
            state.welcomeName = state.privy.wallet.address;
        else state.welcomeName = "user";
    },

    authorizeUser: async () => {
        //update wallet address in backend, and then request for drip if not done, and then set authorized to true
        try {
            // let res = await callAPI("/signin");
            console.log("call backend API");
            await new Promise((resolve) => setTimeout(resolve, 2500));
            state.authorized = true;
            state.isLoggingIn = false;
        } catch (err) {
            console.error(err);
        }
    },
});

function useUser() {
    const snap = useSnapshot(state);
    return snap;
}

export { state as User, useUser };
