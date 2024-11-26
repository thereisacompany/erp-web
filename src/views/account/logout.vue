<script>
import { fetchLoginOut } from "@/api/systemApi";
export default {
  async created() {
    console.log("/logout");
    await fetchLoginOut();
  },
};
</script>