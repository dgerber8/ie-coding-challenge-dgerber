using System.ComponentModel.DataAnnotations.Schema;

namespace ie_coding_challenge_dgerber.Server.Models
{
    public class InputData
    {
        public long Id { get; set; }
        public String? FileName { get; set; }
        [NotMapped]
        public IFormFile? File { get; set; }
    }
}
